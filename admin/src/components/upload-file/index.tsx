import React, { useState, useRef, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import type { RcFile } from "antd/es/upload/interface";
import { uploadMultipleImages } from "@/libs/upload";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface UploadFileProps {
  onImageUpload?: (imageUrls: string[]) => void;
  defaultImages?: string[];
  folder?: string; // Thư mục con trong BE (vd: "product", "user", "uploads")
  maxCount?: number; // Số lượng ảnh tối đa
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadFile: React.FC<UploadFileProps> = ({
  onImageUpload,
  defaultImages = [],
  folder = "uploads",
  maxCount = 8,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const imageBase = apiBase.replace(/\/api\/?$/, "");
  const toAbsolute = (url: string) =>
    url?.startsWith("http") ? url : `${imageBase}${url}`;
  const toRelative = (url: string) =>
    url?.startsWith(imageBase) ? url.slice(imageBase.length) : url;

  const [fileList, setFileList] = useState<UploadFile[]>(
    defaultImages.map((url, index) => ({
      uid: `-${index + 1}`,
      name: `image-${index + 1}.jpg`,
      status: "done" as const,
      url: toAbsolute(url),
    })),
  );

  // Ref để lưu trữ tất cả URLs đã upload
  const uploadedUrlsRef = useRef<string[]>(defaultImages);

  // Keep fileList and emitted urls in sync when defaultImages changes
  useEffect(() => {
    const nextList = defaultImages.map((url, index) => ({
      uid: `-${index + 1}`,
      name: `image-${index + 1}.jpg`,
      status: "done" as const,
      url: toAbsolute(url),
    }));
    setFileList(nextList);
    uploadedUrlsRef.current = [...defaultImages];
    onImageUpload?.([...defaultImages]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultImages)]);

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("Chỉ hỗ trợ file JPG/PNG/WEBP!");
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };

  const saveImagesToBackend = async (files: File[]): Promise<string[]> => {
    try {
      // Tạo FormData để gửi nhiều file
      const formData = new FormData();
      // NOTE: Multer reads fields as they arrive. Ensure 'folder' is appended BEFORE files
      formData.append("folder", folder);

      // Thêm từng file vào FormData
      files.forEach((file, index) => {
        // Tạo tên file theo định dạng ngày/tháng/năm-tên ảnh
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        // Lấy phần tên file gốc (không có extension)
        const originalName = file.name.replace(/\.[^/.]+$/, "");
        const fileExtension = file.name.split(".").pop();

        // Tạo tên file mới: dd-mm-yyyy-tên ảnh.extension
        const newFileName = `${day}-${month}-${year}-${originalName}.${fileExtension}`;

        formData.append("images", file);
        formData.append(`fileName_${index}`, newFileName);
      });

      // Gửi request đến BE để lưu nhiều file
      const response = await uploadMultipleImages(formData);

      if (response.ok) {
        const result = await response.json();

        message.success(result.message);
        return result.imageUrls; // Trả về mảng URL ảnh
      } else {
        const errorData = await response.json();

        throw new Error(errorData.error || "Upload thất bại");
      }
    } catch (error) {
      console.error("💥 Lỗi upload:", error);
      message.error(
        `Upload ảnh thất bại: ${error instanceof Error ? error.message : "Lỗi không xác định"}`,
      );
      throw error;
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    // Chỉ đồng bộ UI; KHÔNG emit ra ngoài ở đây để tránh xóa ảnh khi upload chưa xong
    setFileList(newFileList);
  };

  const handleRemove: UploadProps["onRemove"] = async (file) => {
    // Cập nhật danh sách URL khi xóa một ảnh
    const nextList = (fileList || []).filter((f) => f.uid !== file.uid);
    const urlsRelative = nextList
      .map((f) => f.url)
      .filter(Boolean)
      .map((u) => toRelative(u as string)) as string[];
    uploadedUrlsRef.current = urlsRelative;
    onImageUpload?.([...uploadedUrlsRef.current]);
    setFileList(nextList);
    return true;
  };

  // Custom upload function để xử lý upload thủ công
  const customRequest = async (options: RcCustomRequestOptions) => {
    const { file, onSuccess, onError } = options;

    try {
      // Upload file lên BE
      const rcFile = file as RcFile;
      const imageUrls = await saveImagesToBackend([rcFile as unknown as File]);

      if (imageUrls.length > 0) {
        // Cập nhật fileList với URL mới
        const updatedFile: UploadFile = {
          uid: rcFile.uid,
          name: rcFile.name,
          status: "done" as const,
          url: toAbsolute(imageUrls[0]),
        };

        // Cập nhật fileList
        setFileList((prevFileList) => {
          return prevFileList.map((f) =>
            f.uid === rcFile.uid ? updatedFile : f,
          );
        });

        // Thêm URL mới vào ref
        uploadedUrlsRef.current = [...uploadedUrlsRef.current, imageUrls[0]];

        // Gọi callback với TẤT CẢ URLs đã upload
        if (onImageUpload) {
          onImageUpload([...uploadedUrlsRef.current]);
        }

        onSuccess?.(updatedFile as unknown as never);
      } else {
        onError?.(new Error("Upload thất bại"));
      }
    } catch (error) {
      console.error("❌ Lỗi upload:", error);
      onError?.(
        error instanceof Error
          ? error
          : (new Error("Upload thất bại") as never),
      );
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
        accept="image/*"
        maxCount={maxCount}
        customRequest={customRequest}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          alt=""
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadFile;

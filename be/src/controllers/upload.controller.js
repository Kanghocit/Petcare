import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { UploadService } from "../services/upload.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình multer để xử lý upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.body.folder || "uploads";
    const uploadPath = UploadService.getUploadPath(folder);

    // Tạo thư mục nếu chưa tồn tại
    UploadService.createDirectoryIfNotExists(uploadPath);

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Sử dụng tên file đã được tạo từ frontend hoặc tạo mới
    const fileName =
      req.body.fileName || UploadService.generateFileName(file.originalname);
    cb(null, fileName);
  },
});

// Filter để chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
  if (UploadService.isValidImageFile(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ hỗ trợ file JPG, PNG, WEBP!"), false);
  }
};

// Middleware upload - Hỗ trợ nhiều ảnh
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 10, // Tối đa 10 file
  },
});

// Middleware upload nhiều ảnh
export const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 10, // Tối đa 10 file
  },
});

// Controller upload ảnh (1 ảnh)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Không tìm thấy file ảnh",
      });
    }

    // Kiểm tra kích thước file
    if (!UploadService.isValidFileSize(req.file.size)) {
      return res.status(400).json({
        success: false,
        error: "Kích thước file quá lớn (tối đa 2MB)",
      });
    }

    const folder = req.body.folder || "uploads";
    const fileName = req.file.filename;
    const filePath = path.join(UploadService.getUploadPath(folder), fileName);

    // Lấy thông tin file
    const fileInfo = UploadService.getFileInfo(filePath);

    // Tạo URL để truy cập ảnh
    const imageUrl = `/images/${folder}/${fileName}`;

    res.json({
      success: true,
      message: "Upload ảnh thành công",
      imageUrl: imageUrl,
      fileName: fileName,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileInfo: fileInfo,
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi upload ảnh",
    });
  }
};

// Controller upload nhiều ảnh
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Không tìm thấy file ảnh nào",
      });
    }

    const folder = req.body.folder || "uploads";
    const uploadedImages = [];

    // Xử lý từng file
    for (const file of req.files) {
      try {
        // Kiểm tra kích thước file
        if (!UploadService.isValidFileSize(file.size)) {
          uploadedImages.push({
            originalName: file.originalname,
            success: false,
            error: "Kích thước file quá lớn (tối đa 2MB)",
          });
          continue;
        }

        const fileName = file.filename;
        const filePath = path.join(
          UploadService.getUploadPath(folder),
          fileName
        );

        // Lấy thông tin file
        const fileInfo = UploadService.getFileInfo(filePath);

        // Tạo URL để truy cập ảnh
        const imageUrl = `/images/${folder}/${fileName}`;

        uploadedImages.push({
          originalName: file.originalname,
          success: true,
          imageUrl: imageUrl,
          fileName: fileName,
          fileSize: file.size,
          mimeType: file.mimetype,
          fileInfo: fileInfo,
        });
      } catch (fileError) {
        uploadedImages.push({
          originalName: file.originalname,
          success: false,
          error: fileError.message || "Lỗi xử lý file",
        });
      }
    }

    const successCount = uploadedImages.filter((img) => img.success).length;
    const errorCount = uploadedImages.filter((img) => !img.success).length;

    res.json({
      success: true,
      message: `Upload ${successCount} ảnh thành công${
        errorCount > 0 ? `, ${errorCount} ảnh thất bại` : ""
      }`,
      totalFiles: req.files.length,
      successCount: successCount,
      errorCount: errorCount,
      images: uploadedImages,
      // Trả về mảng URL của các ảnh thành công
      imageUrls: uploadedImages
        .filter((img) => img.success)
        .map((img) => img.imageUrl),
    });
  } catch (error) {
    console.error("Lỗi upload nhiều ảnh:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi upload nhiều ảnh",
    });
  }
};

// Controller lấy danh sách ảnh trong thư mục
export const getImagesByFolder = async (req, res) => {
  try {
    const folder = req.params.folder;
    const folderPath = UploadService.getUploadPath(folder);

    const images = UploadService.getImagesFromFolder(folderPath);
    const folderSize = UploadService.getFolderSize(folderPath);

    res.json({
      success: true,
      images: images,
      folderSize: folderSize,
      totalImages: images.length,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách ảnh:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi lấy danh sách ảnh",
    });
  }
};

// Controller xóa ảnh
export const deleteImage = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const folderPath = UploadService.getUploadPath(folder);
    const filePath = path.join(folderPath, filename);

    if (!UploadService.deleteFile(filePath)) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy file",
      });
    }

    res.json({
      success: true,
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi xóa ảnh",
    });
  }
};

// Controller dọn dẹp file cũ
export const cleanupOldFiles = async (req, res) => {
  try {
    const { folder } = req.params;
    const { daysOld = 30 } = req.query;

    const folderPath = UploadService.getUploadPath(folder);
    const deletedCount = UploadService.cleanupOldFiles(
      folderPath,
      parseInt(daysOld)
    );

    res.json({
      success: true,
      message: `Đã xóa ${deletedCount} file cũ`,
      deletedCount: deletedCount,
      daysOld: parseInt(daysOld),
    });
  } catch (error) {
    console.error("Lỗi dọn dẹp file:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi dọn dẹp file",
    });
  }
};

// Controller lấy thống kê thư mục
export const getFolderStats = async (req, res) => {
  try {
    const folder = req.params.folder;
    const folderPath = UploadService.getUploadPath(folder);

    const images = UploadService.getImagesFromFolder(folderPath);
    const folderSize = UploadService.getFolderSize(folderPath);

    res.json({
      success: true,
      stats: {
        folder: folder,
        totalImages: images.length,
        totalSize: folderSize,
        sizeInMB: (folderSize / (1024 * 1024)).toFixed(2),
        images: images.slice(0, 10), // Chỉ trả về 10 ảnh đầu tiên
      },
    });
  } catch (error) {
    console.error("Lỗi lấy thống kê thư mục:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi lấy thống kê thư mục",
    });
  }
};

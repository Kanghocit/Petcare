import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service để xử lý file system
export class UploadService {
  // Tạo thư mục nếu chưa tồn tại
  static createDirectoryIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  // Lấy đường dẫn thư mục upload
  static getUploadPath(folder) {
    return path.join(__dirname, "../public/images", folder);
  }

  // Kiểm tra file có phải là ảnh không
  static isValidImageFile(mimetype) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jfif",
      "image/pjpeg",
    ];
    return allowedTypes.includes(mimetype);
  }

  // Kiểm tra kích thước file
  static isValidFileSize(size, maxSize = 2 * 1024 * 1024) {
    return size <= maxSize;
  }

  // Lấy danh sách ảnh trong thư mục
  static getImagesFromFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
      return [];
    }

    const files = fs.readdirSync(folderPath);
    return files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return [".jpg", ".jpeg", ".png", ".webp", ".jfif"].includes(ext);
      })
      .map((file) => ({
        name: file,
        url: `/images/${path.basename(folderPath)}/${file}`,
        size: fs.statSync(path.join(folderPath, file)).size,
        path: path.join(folderPath, file),
      }));
  }

  // Xóa file
  static deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }

  // Tạo tên file theo định dạng ngày
  static generateFileName(originalName) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    const extension = path.extname(originalName);

    return `${day}-${month}-${year}-${nameWithoutExt}${extension}`;
  }

  // Lấy thông tin file
  static getFileInfo(filePath) {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stats = fs.statSync(filePath);
    return {
      name: path.basename(filePath),
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  }

  // Kiểm tra dung lượng thư mục
  static getFolderSize(folderPath) {
    if (!fs.existsSync(folderPath)) {
      return 0;
    }

    let totalSize = 0;
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalSize += stats.size;
      }
    });

    return totalSize;
  }

  // Dọn dẹp file cũ (xóa file cũ hơn X ngày)
  static cleanupOldFiles(folderPath, daysOld = 30) {
    if (!fs.existsSync(folderPath)) {
      return 0;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedCount = 0;
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    return deletedCount;
  }
}

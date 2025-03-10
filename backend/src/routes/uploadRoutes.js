const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// In ra đường dẫn để debug
console.log("Uploads directory:", uploadsDir);

// Cấu hình Multer với disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
  },
});

// Route upload ảnh
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh",
      });
    }

    console.log("File uploaded:", req.file);

    // Trả về đường dẫn tới file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải ảnh lên",
    });
  }
});

module.exports = router;

// upload.js
const multer = require("multer");
const path = require("path");

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // guarda en /uploads
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Filtrar por tipo de archivo opcional (solo imágenes)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Solo se permiten imágenes."), false);
};

// Exportar configuración lista para usar
const upload = multer({ storage, fileFilter });

module.exports = upload;

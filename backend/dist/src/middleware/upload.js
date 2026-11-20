import multer from "multer";
const storage = multer.memoryStorage();
const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
];
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 3,
    },
    fileFilter: (req, file, callback) => {
        console.log("MIME type recebido:", file.mimetype);
        if (!tiposPermitidos.includes(file.mimetype)) {
            return callback(new Error("Formato de imagem não permitido"));
        }
        callback(null, true);
    },
});
export default upload;

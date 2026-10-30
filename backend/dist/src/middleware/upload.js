"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
];
const upload = (0, multer_1.default)({
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
exports.default = upload;

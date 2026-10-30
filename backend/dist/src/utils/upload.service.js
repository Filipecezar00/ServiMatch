"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarImagemCloudinary = enviarImagemCloudinary;
const node_stream_1 = require("node:stream");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
function enviarImagemCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.uploader.upload_stream({
            folder: "servimatch/utils",
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("O cloudinary não retornou o resultado do upload"));
            }
            resolve({
                imageUrl: result.secure_url,
                publicId: result.public_id,
            });
        });
        node_stream_1.Readable.from(buffer).pipe(stream);
    });
}

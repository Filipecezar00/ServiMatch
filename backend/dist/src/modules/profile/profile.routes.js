"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const profile_controller_js_1 = require("../profile/profile.controller.js");
const auth_js_1 = require("../../middleware/auth.js");
const upload_js_1 = __importDefault(require("../../middleware/upload.js"));
const express_1 = __importDefault(require("express"));
const profile_router = express_1.default.Router();
profile_router.get("/profile/:id", auth_js_1.authMiddleware, profile_controller_js_1.Informacoes_profile_controller);
profile_router.patch("/profile", auth_js_1.authMiddleware, profile_controller_js_1.EditarProfile_controller);
profile_router.patch("/fotoPerfil", auth_js_1.authMiddleware, upload_js_1.default.single("imagem"), profile_controller_js_1.EditarFoto_controller);
exports.default = profile_router;

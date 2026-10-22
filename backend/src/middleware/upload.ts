import multer from "multer"; 
import type { Request } from "express";

const storage = multer.memoryStorage(); 

 const tiposPermitidos = [
   "image/jpeg", 
   "image/png", 
   "image/webp"
]; 

const upload = multer({
    storage,
    limits:{
        fileSize: 5 * 1024 * 1024,
        files:1,
    }, 
    fileFilter:(req:Request,file:{ mimetype: string },callback:multer.FileFilterCallback) =>{
       
    if(!tiposPermitidos.includes(file.mimetype)){
        return callback(new Error("Formato de imagem não permitido")); 
    }
    callback(null,true); 
    }, 
}); 

export default upload;
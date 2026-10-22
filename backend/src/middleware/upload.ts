import multer from "multer"; 
 
const storage = multer.memoryStorage(); 

const upload = multer({
    storage,
    limits:{
        fileSize: 5 * 1024 * 1024,
        files:1,
    }, 
    fileFilter:(req:any,file:any,callback:any) =>{
        const tiposPermitidos = [
            "image/jpeg", 
            "image/png", 
            "image/webp"
        ]; 
    if(!tiposPermitidos.includes(file.mimetype)){
        return callback(new Error("Formato de imagem não permitido")); 
    }
    callback(null,true); 
    }, 
}); 

export default upload;
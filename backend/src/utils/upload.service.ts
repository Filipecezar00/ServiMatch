import {Readable} from "node:stream"; 
import cloudinary from "../config/cloudinary";

export function enviarImagemCloudinary(buffer:Buffer):Promise<{imageUrl:string; publicId:string}>{
return new Promise((resolve,reject)=>{
    const stream = cloudinary.uploader.upload_stream(
        {
            folder:"servimatch/utils",
            resource_type:"image", 
        }, 
        (error,result)=>{
            if(error){
                return reject(error); 
            }
            if(!result){
                return reject(
                    new Error("O cloudinary não retornou o resultado do upload"),
                )
            }
            resolve({
                imageUrl:result.secure_url,
                publicId:result.public_id, 
            }); 
        }, 
    ); 
    Readable.from(buffer).pipe(stream); 
});
}
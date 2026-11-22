import cors from "cors"

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin)=>origin.trim()) : []; 

export const corsOptions:cors.CorsOptions = {
    origin:(origin,callback)=>{
        if(!origin){
            return callback(null,true); 
        }
        if(allowedOrigins.includes(origin)){
            return callback(null,true);
        }
        return callback(new Error("Origem não autorizada pelo CORS")); 
    },
}; 
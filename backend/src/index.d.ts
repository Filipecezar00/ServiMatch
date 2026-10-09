import express from "express";

declare global {
    namespace Express {
        interface Request {
             usuario?:{
                id:number; 
                email:string; 
                nome:string; 
             }
        }
    }
}
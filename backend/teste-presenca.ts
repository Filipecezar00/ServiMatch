import {io} from "socket.io-client"; 

const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywibm9tZSI6IkNhcmxvcyIsImVtYWlsIjoiY2FybG9zQGdtYWlsLmNvbSIsImlhdCI6MTc5NDUzMTk0NSwiZXhwIjoxNzk0NTM1NTQ1fQ.Kb5LwjiU_TNimwZoAeeVc_B5P2Zxbgn0U9r7d4dfNWA";

const socket = io("http://192.168.15.5:3000",{
    transports:['websocket'],
    auth:{
        token:`Bearer ${token}`
    }
}); 

socket.on("connect",()=>{
    console.log("Usuário 7 conectado ao Socket.IO!");
    console.log("Socket ID:",socket.id);
}); 

socket.on("connect_error",(error)=>{
    console.log("Erro de conexão:",error.message); 
}); 

socket.on("disconnect",(reason)=>{
    console.log("Usuário 7 desconectado:",reason); 
})

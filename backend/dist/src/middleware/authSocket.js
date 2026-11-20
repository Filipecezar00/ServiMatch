import jwt from "jsonwebtoken";
export function authSocket(socket, next) {
    let token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Token não fornecido"));
    }
    if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "").trim();
    }
    try {
        const secret = process.env.TOKEN_JWT || "";
        const resultado = jwt.verify(token, secret);
        socket.data.user = {
            id: resultado.id,
            email: resultado.email,
            nome: resultado.nome,
        };
        next();
    }
    catch (error) {
        return next(new Error("Token inválido ou expirado"));
    }
}

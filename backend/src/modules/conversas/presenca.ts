const usuariosOnline = new Map<number, Set<string>>();

export function adicionarConexao(usuarioId:number,socketId:string){
    if(!usuariosOnline.has(usuarioId)){
        usuariosOnline.set(usuarioId,new Set()); 
    }
    usuariosOnline.get(usuarioId)!.add(socketId); 
}


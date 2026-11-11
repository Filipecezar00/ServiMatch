const usuariosOnline = new Map<number, Set<string>>();

export function adicionarConexao(usuarioId:number,socketId:string){
    if(!usuariosOnline.has(usuarioId)){
        usuariosOnline.set(usuarioId,new Set()); 
    }
    usuariosOnline.get(usuarioId)!.add(socketId); 
}

export function removerConexao(usuarioId:number,socketId:string){
    const conexoes = usuariosOnline.get(usuarioId); 
    if(!conexoes){
        return; 
    }
    conexoes.delete(socketId); 
    if(conexoes.size === 0 ) {
        usuariosOnline.delete(usuarioId); 
    }
}

export function usuarioEstaOnline(usuarioId:number):boolean{
    return usuariosOnline.has(usuarioId); 
}
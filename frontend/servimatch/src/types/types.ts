export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  CriarServico: undefined;
  ListarMeusServicos: undefined;
  ListarServicosProcurados: undefined;
  CriarServicoProcurado: undefined;
  EditarServicoProcurado: { id: number };
  DetalhesServico: { id: number };
  MinhasPropostas: { id: number };
  MinhasTrocas: undefined;
  Profile: { id: number } | undefined;
  Chat:{conversa_id:number}; 
  ListarChat:undefined; 

  ProfileStack:{
    screen:"Profile" | "Chat"; 
    params?:{id?:number;conversa_id?:number}; 
  }|undefined;
};

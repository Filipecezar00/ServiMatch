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
};

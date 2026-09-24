import { MeusServicos } from "../screens/services_offered/MeusServicosScreen";
import { CriarServicoScreen } from "../screens/services_offered/CriarServicoScreen";
import { EditarServico } from "../screens/services_offered/EditarServicoScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ListarServicosProcurados } from "../screens/services_wanted/MeusServicosScreen";
import { CriarServicoWanted } from "../screens/services_wanted/CriarServicoScreen";
import { EditarServicoWanted } from "../screens/services_wanted/EditarServicoScreen";

export type ServiceStackParamList = {
  ListarMeusServicos: undefined;
  CriarServico: undefined;
  EditarServico: { id: number };
  ListarServicosProcurados: undefined;
  CriarServicoProcurado: undefined;
  EditarServicoProcurado: { id: number };
};

const Stack = createNativeStackNavigator<ServiceStackParamList>();

export function ServicesStack() {
  return (
    <Stack.Navigator initialRouteName="ListarMeusServicos">
      <Stack.Screen component={CriarServicoScreen} name="CriarServico" />
      <Stack.Screen component={MeusServicos} name="ListarMeusServicos" />
      <Stack.Screen component={EditarServico} name="EditarServico" />
      <Stack.Screen
        component={ListarServicosProcurados}
        name="ListarServicosProcurados"
      />
      <Stack.Screen
        component={CriarServicoWanted}
        name="CriarServicoProcurado"
      />
      <Stack.Screen
        component={EditarServicoWanted}
        name="EditarServicoProcurado"
      />
    </Stack.Navigator>
  );
}

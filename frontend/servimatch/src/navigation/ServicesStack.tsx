import { MeusServicos } from "../screens/MeusServicosScreen";
import { CriarServicoScreen } from "../screens/CriarServicoScreen";
import { EditarServico } from "../screens/EditarServicoScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type ServiceStackParamList = {
  ListarMeusServicos: undefined;
  CriarServico: undefined;
  EditarServico: { id: number };
};

const Stack = createNativeStackNavigator<ServiceStackParamList>();

export function ServicesStack() {
  return (
    <Stack.Navigator initialRouteName="ListarMeusServicos">
      <Stack.Screen component={CriarServicoScreen} name="CriarServico" />
      <Stack.Screen component={MeusServicos} name="ListarMeusServicos" />
      <Stack.Screen component={EditarServico} name="EditarServico" />
    </Stack.Navigator>
  );
}

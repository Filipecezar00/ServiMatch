import { MeusServicos } from "../screens/MeusServicosScreen";
import { CriarServicoScreen } from "../screens/CriarServicoScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type ServiceStackParamList = {
  ListarMeusServicos: undefined;
  CriarServico: undefined;
};

const Stack = createNativeStackNavigator<ServiceStackParamList>();

export function ServicesStack() {
  return (
    <Stack.Navigator initialRouteName="ListarMeusServicos">
      <Stack.Screen component={CriarServicoScreen} name="CriarServico" />
      <Stack.Screen component={MeusServicos} name="ListarMeusServicos" />
    </Stack.Navigator>
  );
}

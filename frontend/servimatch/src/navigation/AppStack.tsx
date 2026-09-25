import { AppStackParamList } from "../types/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { CriarServicoScreen } from "../screens/services_offered/CriarServicoScreen";
import { MeusServicos } from "../screens/services_offered/MeusServicosScreen";
import { CriarServicoWanted } from "../screens/services_wanted/CriarServicoScreen";
import { EditarServicoWanted } from "../screens/services_wanted/EditarServicoScreen";
import { ListarServicosProcurados } from "../screens/services_wanted/MeusServicosScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CriarServico" component={CriarServicoScreen} />
      <Stack.Screen name="ListarMeusServicos" component={MeusServicos} />
      <Stack.Screen
        name="CriarServicoProcurado"
        component={CriarServicoWanted}
      />
      <Stack.Screen
        name="EditarServicoProcurado"
        component={EditarServicoWanted}
      />
      <Stack.Screen
        name="ListarServicosProcurados"
        component={ListarServicosProcurados}
      />
    </Stack.Navigator>
  );
}

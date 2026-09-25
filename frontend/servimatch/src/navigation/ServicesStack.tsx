import { MeusServicos } from "../screens/services_offered/MeusServicosScreen";
import { CriarServicoScreen } from "../screens/services_offered/CriarServicoScreen";
import { EditarServico } from "../screens/services_offered/EditarServicoScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ListarServicosProcurados } from "../screens/services_wanted/MeusServicosScreen";
import { CriarServicoWanted } from "../screens/services_wanted/CriarServicoScreen";
import { EditarServicoWanted } from "../screens/services_wanted/EditarServicoScreen";

export type ServiceStackOfferedParamList = {
  ListarMeusServicos: undefined;
  CriarServico: undefined;
  EditarServico: { id: number };
};

export type ServiceStackWantedParamList = {
  ListarServicosProcurados: undefined;
  CriarServicoProcurado: undefined;
  EditarServicoProcurado: { id: number };
};

const Stack = createNativeStackNavigator<ServiceStackOfferedParamList>();
const Stack_Wanted = createNativeStackNavigator<ServiceStackWantedParamList>();

export function ServicesOfferedStack() {
  return (
    <Stack.Navigator initialRouteName="ListarMeusServicos">
      <Stack.Screen component={CriarServicoScreen} name="CriarServico" />
      <Stack.Screen component={MeusServicos} name="ListarMeusServicos" />
      <Stack.Screen component={EditarServico} name="EditarServico" />
    </Stack.Navigator>
  );
}

export function ServicesWantedStack() {
  return (
    <Stack_Wanted.Navigator initialRouteName="ListarServicosProcurados">
      <Stack_Wanted.Screen
        component={CriarServicoWanted}
        name="CriarServicoProcurado"
      />
      <Stack_Wanted.Screen
        component={EditarServicoWanted}
        name="EditarServicoProcurado"
      />

      <Stack_Wanted.Screen
        component={ListarServicosProcurados}
        name="ListarServicosProcurados"
      />
    </Stack_Wanted.Navigator>
  );
}

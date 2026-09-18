import { AppStackParamList } from "../types/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { CriarServicoScreen } from "../screens/CriarServicoScreen";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CriarServico" component={CriarServicoScreen} />
    </Stack.Navigator>
  );
}

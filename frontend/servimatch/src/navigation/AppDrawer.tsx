import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Pressable, Text } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import { HomeScreen } from "../screens/HomeScreen";
import { ServicesStack } from "../navigation/ServicesStack";
type AppDrawerParamList = {
  Home: undefined;
  Servicos: undefined;
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const logout = useAuthStore((state) => state.logout);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Pressable onPress={() => logout()}>
        <Text>Sair</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

export function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen component={HomeScreen} name="Home" />
      <Drawer.Screen
        component={ServicesStack}
        name="Servicos"
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

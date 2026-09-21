import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import { HomeScreen } from "../screens/HomeScreen";
import { ServicesStack } from "../navigation/ServicesStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type AppDrawerParamList = {
  Home: undefined;
  Servicos: undefined;
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const logout = useAuthStore((state) => state.logout);
  const usuario = useAuthStore((state) => state.usuario);

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <MaterialCommunityIcons name="account-circle" size={50} />
        <Text>Bem vindo, {usuario?.nome}</Text>
        <Text>Email: {usuario?.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <Pressable onPress={() => logout()}>
        <MaterialCommunityIcons name="exit-to-app" size={22} />
        <Text>Sair</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}

export function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#4a5344",
        drawerType: "slide",
      }}
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

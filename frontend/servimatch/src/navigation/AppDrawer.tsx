import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import {
  ServicesOfferedStack,
  ServicesWantedStack,
  HomeScreenStack,
  ProposalsStack,
  Exchanges_stack,  
  Chat_Stack,
  Profile_Stack
} from "../navigation/ServicesStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Profile } from "../screens/profile/profileScreen";

type AppDrawerParamList = {
  HomeStack: undefined;
  MeusServicosOffered: undefined;
  MeusServicosWanted: undefined;
  ProposalStack: undefined;
  ExchangesStack: undefined;
  ProfileStack: { id: number } | undefined;
  ChatStack:undefined
};

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const logout = useAuthStore((state) => state.logout);
  const usuario = useAuthStore((state) => state.usuario);

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <Pressable
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("ProfileStack",{
              screen:"Profile",
              params:{id:undefined}, 
            });
          }}
        >
          <MaterialCommunityIcons name="account-circle" size={50} />
          <Text>Bem vindo, {usuario?.nome}</Text>
          <Text>Email: {usuario?.email}</Text>
        </Pressable>
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
      <Drawer.Screen
        component={HomeScreenStack}
        name="HomeStack"
        options={{ headerShown: false, title: "Home" }}
      />
      <Drawer.Screen
        component={ServicesOfferedStack}
        name="MeusServicosOffered"
        options={{ headerShown: false, title: "Meus Serviços Oferecidos" }}
      />
      <Drawer.Screen
        component={ServicesWantedStack}
        name="MeusServicosWanted"
        options={{ headerShown: false, title: "Meus Serviços Desejados" }}
      />
      <Drawer.Screen
        component={ProposalsStack}
        name="ProposalStack"
        options={{ headerShown: false, title: "Minhas Propostas" }}
      />
      <Drawer.Screen
        component={Exchanges_stack}
        name="ExchangesStack"
        options={{ headerShown: false, title: "Minhas Trocas" }}
      />

      <Drawer.Screen
        component={Profile_Stack}
        name="ProfileStack"
        options={{
          headerShown: false,
          title: "Meu Perfil",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
      component={Chat_Stack}
      name="ChatStack"
      options={{
        headerShown:false, 
        title:"Minhas Conversas", 
      }}
      />
    </Drawer.Navigator>
  );
}

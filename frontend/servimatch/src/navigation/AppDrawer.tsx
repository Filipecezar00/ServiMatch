import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { Pressable, Text, View, Image,StyleSheet } from "react-native";
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
import { useQuery } from "@tanstack/react-query";
import { profile_informations } from "../api/profile";
import { theme } from "../styles/theme/theme";
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

  const {data:profile,isLoading} = useQuery({
    queryKey:["Profile",usuario?.id],
    queryFn:()=>profile_informations(usuario?.id),
    enabled:!!usuario?.id
  })

  const fotoPerfil = profile?.usuario?.image_url

  function abrirMeuPerfil(){
    props.navigation.closeDrawer(); 
    props.navigation.navigate("ProfileStack",{
      screen:"Profile",
      params:{id:undefined},
    });
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View>
        <Pressable
          onPress={abrirMeuPerfil}
          style={styles.cabecalho}
        >
        <View style={styles.containerFoto}>
             
         {fotoPerfil?(
          <Image source={{uri:fotoPerfil}}
          style={styles.fotoPerfil}
          />
          ):(
            <MaterialCommunityIcons name="account-circle" size={64} color={theme.colors.primary}/>
          )}
         </View>
    
          <View style={styles.informacoesUsuario}>
          <Text style={styles.nomeUsuario} numberOfLines={1}>Bem vindo, {usuario?.nome}</Text>
          <Text style={styles.emailUsuario} numberOfLines={1}>Email: {usuario?.email}</Text>
          </View>
        </Pressable>
      </View>
      <DrawerItemList {...props} />
      <Pressable onPress={() => logout()} style={styles.botaoSair}>
        <MaterialCommunityIcons name="exit-to-app" size={22} color={theme.colors.error}/>
        <Text style={styles.textoSair}>Sair</Text>
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
const styles = StyleSheet.create({
  drawerContent:{
    flexGrow:1,
  }, 
  cabecalho:{
    flexDirection:"row",
    alignItems:"center", 
    paddingHorizontal:16,
    paddingVertical:24,
    backgroundColor:theme.colors.surface
  }, 
  containerFoto:{
    width:64,
    height:64,
    borderRadius:32,
    alignItems:"center", 
    justifyContent:"center", 
    overflow:"hidden", 
    backgroundColor:theme.colors.background
  }, 
  informacoesUsuario:{
    flex:1,
    marginLeft:12,
    marginRight:8
  },
  nomeUsuario:{
    fontSize:16,
    fontWeight:"700",
    color:theme.colors.textPrimary
  }, 
  emailUsuario:{
    fontSize:12,
    color:theme.colors.textSecondary,
    marginTop:4,
  }, 
  fotoPerfil:{
    width:"100%",
    height:"100%",
    borderRadius:32
  },
  textoSair:{
    marginLeft:12,
    fontSize:14,
    fontWeight:"600",
    color:theme.colors.error
  },
  botaoSair:{
    flexDirection:"row",
    alignItems:"center", 
    paddingHorizontal:16,
    paddingVertical:14,
    marginTop:"auto"
  }
})
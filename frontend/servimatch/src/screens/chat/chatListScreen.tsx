import { View,Text,FlatList, Pressable, ActivityIndicator,StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {listarConversas} from "../../api/chat"
import { useNavigation } from "@react-navigation/native";
import {Conversas} from "../../types/chat"
import { theme } from "../../styles/theme/theme";

export function ChatList(){
    const {data:conversas,isError,isPending,refetch} = useQuery<Conversas[]>({
        queryKey:["listaConversas"],
        queryFn:listarConversas
    })
    const navigation = useNavigation<any>(); 


    function formatarData(data:string){
        return new Date(data).toLocaleString("pt-br");
    }

    if(isPending){
        return(
            <View>
                <ActivityIndicator size="large"/>
            </View>
        )
    }
    

    return (
        <View style={styles.container}>
            {isError&&(
                <View>
                    <Text>Erro ao renderizar Lista de conversas</Text>
                    <Pressable onPress={()=>refetch()}>Tentar Novamente</Pressable>
                </View>
            )}
            {isPending&&(
                <ActivityIndicator size={18}/>
            )}
            {conversas?.length==0?(
            <View style={styles.estadoVazio}>
                <Text style={styles.textoEstadoVazio}>Nenhuma conversa por enquanto</Text>
                <Text style={styles.descricaoEstadoVazio}>Quando você iniciar uma negociação, suas conversas aparecerão aqui</Text>
            </View>
            ):(
        <View>
        <View style={styles.header}>
          <Text style={styles.title}>Minhas Conversas</Text>
          <Text style={styles.subtitle}>Acompanhe suas mensagens</Text>
        </View>
            <FlatList data={conversas || []} keyExtractor={(item)=>String(item?.id)} renderItem={({item})=>(
                <Pressable onPress={()=>navigation.navigate("Chat",{conversa_id:item.id})}>
                <View style={styles.lista}>
                 <View style={styles.card}>
                    <Text style={styles.nomeUsuario}>{item.nome_outro_usuario}</Text>
                    <Text style={styles.informacaoData}>Atualizado em: {formatarData(item.updated_at)}</Text>
                    <Text>Desde de : {formatarData(item.created_at)}</Text>
                 </View>
                </View>
                </Pressable>
            )}/>
            </View>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
container:{
flex:1, 
backgroundColor:theme.colors.background
}, 
header:{
paddingHorizontal:theme.spacing.lg,
paddingTop:theme.spacing.lg,
paddingBottom:theme.spacing.md, 
alignItems:"center"
},
title:{
fontSize:24,
fontWeight:"700", 
color:theme.colors.textPrimary, 
marginBottom:theme.spacing.xs
}, 
subtitle:{
fontSize:16, 
fontWeight:"400", 
color:theme.colors.textSecondary
},
lista:{
paddingHorizontal:theme.spacing.md, 
paddingBottom:theme.spacing.lg,
flexGrow:1
}, 
card:{
backgroundColor:theme.colors.surface,
padding:theme.spacing.md, 
borderRadius:theme.borderRadius.lg,
borderWidth:1, 
borderColor:theme.colors.border, 
marginBottom:theme.spacing.md
}, 
nomeUsuario:{
fontSize:16, 
fontWeight:"700",
color:theme.colors.textPrimary,
marginBottom:theme.spacing.sm
}, 
informacaoData:{
fontSize:13,
color:theme.colors.textSecondary, 
marginTop:theme.spacing.xs
}, 
estadoVazio:{
}, 
textoEstadoVazio:{

}, 
descricaoEstadoVazio:{

}
})
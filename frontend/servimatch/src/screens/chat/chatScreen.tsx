import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect,useState } from "react";
import { useQuery,useQueryClient } from "@tanstack/react-query";
import {carregarHistorico} from "../../api/chat"
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from "react-native";
import { Mensagens,HistoricoMensagens } from "../../types/chat";
import { TextInput } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { theme } from "../../styles/theme/theme";
export function ChatScreen(){
const socket = useAuthStore((state)=>state.socket);
const [isMensagens,setIsMensagens] = useState(""); 
const usuario = useAuthStore((state)=>state.usuario)

const queryClient= useQueryClient();
const route = useRoute<any>();
const conversa_id = route.params?.conversa_id

const [roomId,setIsRoomId] = useState<number|null>(conversa_id||null);


const handleNewMessage = (novaMensagem:Mensagens)=>{
queryClient.setQueryData<Mensagens[]>(["historicoMensagens",roomId],(historicoAntigo:any)=>{
    if(historicoAntigo && typeof historicoAntigo==='object' && Array.isArray(historicoAntigo.data)){
        return {
            ...historicoAntigo,
            data:[novaMensagem,...historicoAntigo.data]
        }
    }
    const listaAtual = Array.isArray(historicoAntigo) ? historicoAntigo : []; 
    return [novaMensagem,...listaAtual]
})
}

useEffect(()=>{
if(!socket || !roomId){
    return
}

socket?.emit("join_room",{roomId})

socket?.on("receive_message",handleNewMessage); 
return()=>{
socket?.off("receive_message")
socket?.emit("leave_room",{roomId})
}

},[socket,roomId])

const {data:mensagens,isError,isPending} = useQuery<HistoricoMensagens>({
    queryKey:["historicoMensagens",roomId],
    queryFn:()=>carregarHistorico(roomId!), 
    enabled:!!roomId
})

function formatarHora(data:string){
return new Date(data).toLocaleString("pt-br",{
    hour:"2-digit",
    minute:'2-digit'
})
}

const handleEnviarMensagem = ()=>{
    if(isMensagens.trim()=="") return
    socket?.emit("send_message",{roomId,mensagem:isMensagens})

    setIsMensagens(""); 
}

if(isError){
return(
<View style={[styles.container,styles.estadoCentralizado]}>
    <Text style={styles.textoEstado}>
        Erro ao renderizar historico de mensagens
    </Text>
</View>
)
}
if(isPending){
return(
    <View style={[styles.container,styles.estadoCentralizado]}>
     <ActivityIndicator size="large" color={theme.colors.primary}/>
    </View>
)
}
if(!roomId){
    return(
        <View style={[styles.container,styles.estadoCentralizado]}>
            <Text style={styles.textoEstado}>
                Não foi possível identificar a conversa
            </Text>
        </View>
    )
}


return (
<KeyboardAvoidingView behavior={Platform.OS ==="ios"? 'padding':"height"} style={{flex:1}} keyboardVerticalOffset={Platform.OS === "ios"?90:0} >
     {mensagens?.data.length==0&&(
            <View>
                <Text>Nenhuma mensagem ainda, mande um Oi!</Text>
            </View>
    )}
    <FlatList
    data={mensagens?.data||[]}
    inverted
    keyExtractor={(mensagem)=>String(mensagem.id)}
    style={{flex:1}}
    renderItem={(({item})=>{
        const ehMinhaMensagem =  item.sender_id === usuario?.id
        return(
            <View style={[styles.containerMensagem,ehMinhaMensagem?styles.minhaMensagem:styles.mensagemRecebida]}>
                <Text style={[styles.textoMensagem,ehMinhaMensagem ? styles.textoMinhaMensagem:styles.textoMensagemRecebida]}>{item.mensagem}</Text>
                <Text style={[styles.dataMensagem,ehMinhaMensagem?styles.dataMinhaMensagem:styles.dataMensagemRecebidas]}>{formatarHora(item.created_at)}</Text>
                {ehMinhaMensagem && item.lido && <Text style={styles.statusLeitura}>Visualizado</Text>}
            </View>
        )
    })}
    />
    <View style={styles.containerEnvio}>
    <TextInput value={isMensagens} placeholder="Digite sua mensagem..." placeholderTextColor={theme.colors.textSecondary} onChangeText={setIsMensagens} style={styles.campoMensagem} multiline/>
    <Pressable onPress={handleEnviarMensagem} disabled={!isMensagens.trim()} style={({pressed})=>[
        styles.btnEnviar, 
        pressed && styles.btnEnviarPressionado, 
        !isMensagens.trim() && styles.btnEnviarDesabilitado
    ]}><Text style={styles.textBtnEnviar}>Enviar</Text></Pressable>
    </View>
  </KeyboardAvoidingView>
)
}
const styles = StyleSheet.create({
container:{
flex:1,
backgroundColor:theme.colors.background
},
containerMensagem:{
maxWidth:"80%", 
paddingHorizontal:theme.spacing.md, 
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.lg,
marginVertical:theme.spacing.xs
},
minhaMensagem:{
alignSelf:"flex-end", 
backgroundColor:theme.colors.primary, 
borderBottomRightRadius:theme.borderRadius.sm
},
mensagemRecebida:{
alignSelf:"flex-start", 
backgroundColor:theme.colors.surface,
borderWidth:1,
borderColor:theme.colors.border,
borderBottomLeftRadius:theme.borderRadius.sm
},
textoMensagem:{
fontSize:15,
lineHeight:21
},
textoMinhaMensagem:{
color:theme.colors.surface
},
textoMensagemRecebida:{
color:theme.colors.textPrimary
},
dataMensagem:{
fontSize:11,
marginTop:theme.spacing.xs,
alignSelf:"flex-end"
},
dataMinhaMensagem:{
color:theme.colors.surface
},
dataMensagemRecebidas:{
color:theme.colors.textSecondary
},
statusLeitura:{
fontSize:11,
color:theme.colors.surface,
alignSelf:"flex-end",
marginTop:theme.spacing.xs,
fontStyle:"italic"
}, 
containerEnvio:{
flexDirection:"row",
alignItems:"flex-end",
paddingHorizontal:theme.spacing.md, 
paddingVertical:theme.spacing.sm,
backgroundColor:theme.colors.surface,
borderTopWidth:1,
borderTopColor:theme.colors.border, 
gap:theme.spacing.sm
}, 
campoMensagem:{
flex:1,
minHeight:44,
maxHeight:120,
borderWidth:1,
borderColor:theme.colors.border,
borderRadius:theme.borderRadius.lg,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
backgroundColor:theme.colors.background,
color:theme.colors.textPrimary,
fontSize:15
}, 
btnEnviar:{
minHeight:44,
justifyContent:"center",
alignItems:"center",
paddingHorizontal:theme.spacing.md, 
borderRadius:theme.borderRadius.md,
backgroundColor:theme.colors.primary
}, 
textBtnEnviar:{
color:theme.colors.surface,
fontWeight:"700"
},
btnEnviarPressionado:{
opacity:0.8,
}, 
btnEnviarDesabilitado:{
opacity:0.5,
},
estadoCentralizado:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:theme.spacing.xl
}, 
textoEstado:{
    color:theme.colors.textSecondary,
    fontSize:15,
    textAlign:"center"
},

})
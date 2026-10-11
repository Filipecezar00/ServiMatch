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
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Mensagens,HistoricoMensagens } from "../../types/chat";
import { TextInput } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
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
console.log("Frontend recebeu receive_message do servidor",novaMensagem)
}

useEffect(()=>{
if(!socket || !roomId){
    return
}

console.log("Registrando socket join e listeners para a sala:",roomId); 
socket?.emit("join_room",{roomId})

socket?.on("receive_message",handleNewMessage); 
return()=>{
console.log("Limpando socket listeners da sala:",roomId)
socket?.off("receive_message")
socket?.emit("leave_room",{roomId})
}

},[socket,roomId])

const {data:mensagens,isError,isPending} = useQuery<HistoricoMensagens>({
    queryKey:["historicoMensagens",roomId],
    queryFn:()=>carregarHistorico(roomId!), 
    enabled:!!roomId
})

const handleEnviarMensagem = ()=>{
    if(isMensagens.trim()=="") return
    console.log("Enviando via socket para a sala:",roomId,"Mensagem:",isMensagens)
    socket?.emit("send_message",{roomId,mensagem:isMensagens})

    setIsMensagens(""); 
}

return (
<KeyboardAvoidingView behavior={Platform.OS ==="ios"? 'padding':"height"} style={{flex:1}} keyboardVerticalOffset={Platform.OS === "ios"?90:0} >
  <View style={{flex:1}}>
    {isError&&(
        <View>
            <Text>
                Erro ao renderizar historico de mensagens
            </Text>
        </View>
    )}
    {isPending&&(
        <ActivityIndicator size={18}/>
    )}
    <FlatList
    data={mensagens?.data||[]}
    inverted={true}
    keyExtractor={(mensagem)=>String(mensagem.id)}
    style={{flex:1}}
    renderItem={(({item})=>{
        const ehMinhaMensagem =  item.sender_id === usuario?.id
        return(
            <View style={{backgroundColor:ehMinhaMensagem ? "#2298af":"#ffffff",alignItems:ehMinhaMensagem?"flex-end":"flex-start"}}>
                <Text>{item.mensagem}</Text>
                <Text>Enviado em : {item.created_at}</Text>
                {item.lido ? <Text style={{fontStyle:"italic"}}>Visualizado</Text> : null}
            </View>
        )
    })}
    />
    <View style={{marginTop:10,flexDirection:"row",alignItems:"center"}}>
    <TextInput value={isMensagens} onChangeText={setIsMensagens} style={{flex:1,borderWidth:1,borderColor:"#ccc",padding:8,borderRadius:4,backgroundColor:"#fff", marginBottom:40}}/>
    <Pressable onPress={handleEnviarMensagem} style={{marginLeft:8,padding:10,backgroundColor:"#2298af",borderRadius:4,marginBottom:40}}><Text>Enviar</Text></Pressable>
    </View>
  </View>  
  </KeyboardAvoidingView>
)
}

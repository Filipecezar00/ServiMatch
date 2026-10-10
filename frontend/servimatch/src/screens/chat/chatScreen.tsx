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
import { Mensagens } from "../../types/chat";
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
queryClient.setQueryData<Mensagens[]>(["historicoMensagens",roomId],(historicoAntigo)=>{
    return [novaMensagem,...(historicoAntigo||[])]
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

const {data:mensagens,isError,isPending} = useQuery({
    queryKey:["historicoMensagens",roomId],
    queryFn:()=>carregarHistorico(roomId!), 
    enabled:!!roomId
})

const handleEnviarMensagem = ()=>{
    if(isMensagens.trim()=="") return
    socket?.emit("send_message",{roomId,mensagens:isMensagens})

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
    data={mensagens}
    inverted={true}
    keyExtractor={(mensagem)=>String(mensagem.id)}
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

    <TextInput value={isMensagens} onChangeText={setIsMensagens}/>
    <Pressable onPress={handleEnviarMensagem}>Enviar</Pressable>
  </View>  
  </KeyboardAvoidingView>
)
}

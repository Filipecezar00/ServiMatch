import { View,Text,FlatList, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {listarConversas} from "../../api/chat"
import { useNavigation } from "@react-navigation/native";
import {Conversas} from "../../types/chat"


export function ChatList(){
    const {data:conversas,isError,isPending} = useQuery<Conversas[]>({
        queryKey:["listaConversas"],
        queryFn:listarConversas
    })

    const navigation = useNavigation<any>(); 

    return (
        <View style={{flex:1}}>
            {isError&&(
                <View>
                    <Text>Erro ao renderizar Lista de conversas</Text>
                </View>
            )}
            {isPending&&(
                <ActivityIndicator size={18}/>
            )}
            {conversas?.length==0?(
            <View>
                <Text>Você ainda não possui conversas</Text>
            </View>
            ):(
        <View>
          <Text>Minhas Conversas</Text>
            <FlatList data={conversas || []} keyExtractor={(item)=>String(item?.id || Math.random())} renderItem={({item})=>(
                <Pressable onPress={()=>navigation.navigate("Chat",{conversa_id:item.id})}>
                <View>
                    <Text>{item.nome}</Text>
                    <Text>Atualizado em: {item.updated_at}</Text>
                    <Text>Desde de : {item.created_at}</Text>
                </View>
                </Pressable>
            )}/>
            </View>
            )}
        </View>
    )
}
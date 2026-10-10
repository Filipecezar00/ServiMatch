import { useState } from "react";
import { View,Text,FlatList, Pressable, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {listarConversas} from "../../api/chat"
import { useNavigation } from "@react-navigation/native";



export function ChatList(){
    const {data:conversas,isError,isPending} = useQuery({
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
            <Text>Minhas Conversas</Text>
            <FlatList data={conversas} keyExtractor={(conversa)=>conversa.id.toString()} renderItem={({item})=>(
                <Pressable onPress={()=>navigation.navigate("Chat",{conversa_id:item.id})}>
                <View>
                    <Text>{item.nome}</Text>
                    <Text>Atualizado em: {item.updated_at}</Text>
                    <Text>Desde de : {item.created_at}</Text>
                </View>
                </Pressable>
            )}/>
        </View>
    )
}
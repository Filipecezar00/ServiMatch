import { useState } from "react";
import { View,Text,FlatList, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import {listarConversas} from "../../api/chat"
import { useNavigation } from "@react-navigation/native";



export function ChatList(){
    const {data:conversas,isError,isPending} = useQuery({
        queryKey:["listaConversas"],
        queryFn:listarConversas
    })

    const navigation = useNavigation(); 

    return (
        <View>
            <Text>Minhas Conversas</Text>
            <FlatList data={conversas} keyExtractor={(conversa)=>conversa.id} renderItem={({item})=>(
                <Pressable onPress={navigation.navigate("ChatScreen",{conversa_id:item.id})}>
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
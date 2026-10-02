import { useState } from "react";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { View,Modal,Text, Pressable,TextInput,Alert} from "react-native";
import { Troca } from "../types/exchangeTypes";
import {concluirTroca} from "../api/exchange"
import {AvaliarTrocaProps} from "../types/exchangeTypes"
export function AvaliarTroca({visible,troca,onClose,}:AvaliarTrocaProps){

    const [isRating,setIsRating] = useState<number|null>(null); 
    const [isNotes,setIsNotes] = useState(''); 

return(
    <Modal>
        <View>
            <View>
                <Text>Adicione uma nota</Text>
                <Pressable></Pressable>
                <Pressable></Pressable>
                <Pressable></Pressable>
                <Pressable></Pressable>
                <Pressable></Pressable>
            </View>
            <View>
                <TextInput
                value={isNotes}
                placeholder="Adicione um comentário"
                placeholderTextColor="#000000"
                onChangeText={setIsNotes}
                multiline={true}
                numberOfLines={4}
                maxLength={250}
                />
            </View>
            <Pressable>
                <Text>Confirmar conclusão</Text>
            </Pressable>
            <Pressable onPress={()=>onClose()}> 
                <Text>Cancelar</Text>
            </Pressable>
        </View>
    </Modal>
        
    )
}
import { useEffect, useState } from "react";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import {updateTroca} from "../api/exchange"
import { TrocaEditada } from "../types/exchangeTypes";
import { Alert,View,Pressable,Text ,TextInput,Modal} from "react-native";



interface EditarMinhaTroca {
visible:boolean; 
troca:{id:number | null; location:string | null; scheduled_date:string | null} | null; 
onClose:()=>void; 
}

export function EditarMinhaTroca({visible,troca,onClose}:EditarMinhaTroca){
    const [location,setLocation] = useState("")
    const [scheduled_date,setScheduled_date] = useState("")


    const queryClient = useQueryClient()

    useEffect(()=>{
        if(troca){
            setLocation(troca.location || ""); 
            setScheduled_date(troca.scheduled_date || ""); 
        }
    },[troca])

    const {mutate,isPending} = useMutation({
        mutationFn:({exchangeId,location,scheduled_date}:{exchangeId:number;location:string;scheduled_date:string;})=>
        updateTroca(exchangeId,{location,scheduled_date})    
        ,

        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["MinhasTrocas"]})
            Alert.alert("Troca editada com sucesso!")
            onClose();
        }, 
        onError:(error)=>{
            Alert.alert("Erro ao editar troca:",error.message); 
        },
    })

   const handleUpdate=()=>{
    if(!troca?.id){
        return Alert.alert("Selecione um serviço para editar"); 
    }
    if(!location || location.trim().length < 5){
        return Alert.alert("A localização deve possuir no mínimo cinco caracteres"); 
    }

    if(!scheduled_date || scheduled_date.trim().length < 4){
        return Alert.alert("O agendamento deve possuir no mínimo quatro caracteres"); 
    }
    

    mutate({exchangeId:troca.id,location,scheduled_date})
   }
    

  return(
    <Modal visible={visible} animationType="slide" transparent={true} style={{padding:20}}>
         <View style={{
            width:"90%",
            backgroundColor:"#fff",
            padding:20,
            borderRadius:8,
         }}>
            <Text>
                Editar Agendamento
            </Text>
            <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Editar Localização"
            placeholderTextColor="#838383"
            style={{borderWidth:1,borderColor:"#ccc",padding:8,marginBottom:12}}
            />
            <TextInput
            value={scheduled_date}
            onChangeText={setScheduled_date}
            placeholder="Editar data de agendamento"
            placeholderTextColor="#838383"
            style={{borderWidth:1,borderColor:"#ccc",padding:8,marginBottom:12}}
            />
            <Pressable onPress={handleUpdate} disabled={isPending} style={{padding:10,backgroundColor:"#0284c7",marginBottom:8}}>
                <Text>{isPending ? "Salvando...":"Salvar Alterações"}</Text>
            </Pressable>
            
            <Pressable onPress={onClose} style={{padding:10}}>
                <Text style={{textAlign:"center",color:"#666"}}>Cancelar</Text>
            </Pressable>
        </View>
    </Modal>
       
  )


}
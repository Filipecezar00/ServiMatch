import { useEffect, useState } from "react";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import {updateTroca} from "../api/exchange"
import { TrocaEditada } from "../types/exchangeTypes";
import { Alert,View,Pressable,Text ,TextInput,Modal,TouchableWithoutFeedbackBase, Platform,Keyboard,KeyboardAvoidingViewBase,TouchableWithoutFeedback, ScrollView} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";



interface EditarMinhaTroca {
visible:boolean; 
troca:{id:number | null; location:string | null; scheduled_date:string | null} | null; 
onClose:()=>void; 
}

export function EditarMinhaTroca({visible,troca,onClose}:EditarMinhaTroca){
    const [location,setLocation] = useState("")
    const [scheduled_date,setScheduled_date] = useState("")
    const [isDatePickerVisible,setDatePickerVisibility] = useState(false)

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

   const handleConfirmDate = (date:Date)=>{
    const ano = date.getFullYear(); 
    const mes = String(date.getMonth()+1).padStart(2,"0") 
    const dia = String(date.getDate()).padStart(2,"0")
    const horas = String(date.getHours()).padStart(2,"0")
    const minutos = String(date.getMinutes()).padStart(2,"0") 

    const dataFormatada = `${ano}-${mes}-${dia} ${horas}:${minutos}:00`

    setScheduled_date(dataFormatada); 
    setDatePickerVisibility(false);    
   }
    
   const handleOpenDatePicker = ()=>{
    Keyboard.dismiss();
    setTimeout(()=>{
     setDatePickerVisibility(true)
    },150); 
   }; 

  return(
    <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={{
            flex:1,
            backgroundColor:"rgba(0,0,0,0.5)",
            justifyContent:"center",
            alignItems:'center'
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

         <View style={{
            width:"90%",
            backgroundColor:"#fff",
            padding:20,
            borderRadius:8,
         }}>

           <ScrollView keyboardShouldPersistTaps="handled">
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


            <Pressable onPress={handleOpenDatePicker} 
            style={{borderWidth:1,borderColor:"#ccc",padding:12,marginBottom:12,borderRadius:4}}
            >   
            <Text>{scheduled_date?`Data: ${scheduled_date}`:"Selecionar Data e horário"}</Text>
            </Pressable>



            <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            display={Platform.OS ==="ios"?"inline":"spinner"}
            onConfirm={handleConfirmDate}
            onCancel={()=>setDatePickerVisibility(false)}
            confirmTextIOS="Confirmar"
            cancelTextIOS="Cancelar"
            />

            <Pressable onPress={handleUpdate} disabled={isPending} style={{padding:10,backgroundColor:"#0284c7",marginBottom:8}}>
                <Text>{isPending ? "Salvando...":"Salvar Alterações"}</Text>
            </Pressable>
            
            <Pressable onPress={onClose} style={{padding:10}}>
                <Text style={{textAlign:"center",color:"#666"}}>Cancelar</Text>
            </Pressable>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  </View>
</Modal>     
  )
}

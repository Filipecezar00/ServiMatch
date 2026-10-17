import { useState, useEffect } from "react";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import { View, Modal, Text, Pressable, TextInput, Alert,StyleSheet, KeyboardAvoidingView, ScrollViewComponent,Platform, ScrollView } from "react-native";
import { avaliarTroca } from "../api/reviews";
import { theme } from "../styles/theme/theme";
import { AvaliarTrocaProps, Review } from "../types/reviews";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/useAuthStore";
export function AvaliarTroca({
  visible,
  troca,
  onClose,
  onSuccess,
}: AvaliarTrocaProps) {
  const [isRating, setIsRating] = useState<number | null>(null);
  const [isNotes, setIsNotes] = useState("");

  const usuarioLogadoId = useAuthStore((auth) => auth.usuario?.id);

  const queryClient = useQueryClient();
  const { mutate, isPending} = useMutation({
    mutationFn: ({
      exchangeId,
      payload,
    }: {
      exchangeId: number;
      payload: { reviewedId: number; rating: number; comment?: string };
    }) => avaliarTroca(exchangeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MinhasTrocas"] });
      queryClient.invalidateQueries({queryKey:["MeusReviews",usuarioLogadoId]})
      Alert.alert("Sucesso", "Avaliação bem sucedida!");
      onSuccess();
      onClose();
    },
    onError: (erro) => {
      return Alert.alert("Erro ao concluir troca: ", erro?.message);
    },
  });

  useEffect(() => {
    if (visible) {
      setIsRating(null);
      setIsNotes("");
    }
  }, [visible, troca]);

  const handleAvaliar = () => {
    if (!troca?.id) {
      return Alert.alert("Selecione uma troca");
    }
    if (isRating===null || isRating < 1 || isRating>5) {
      return Alert.alert("Atenção","Selecione uma nota de 1 a 5 estrelas");
    }

    if (!usuarioLogadoId) {
      return Alert.alert(
        "Atenção",
        "Sessão do usuário não encontrada.Faça login novamente",
      );
    }

    const reviewedId =
      usuarioLogadoId === troca.proposer_id
        ? troca.receiver_id
        : troca.proposer_id;

    mutate({
      exchangeId: troca.id,
      payload: {
        reviewedId,
        rating: isRating,
        comment: isNotes,
      },
    });
  };

  const estrelas = [1, 2, 3, 4, 5];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
    <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS ==="ios" ? "padding" : "height"}>
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.titulo}>Avalie sua experiência</Text>
          <Text style={styles.subtitulo}>Como foi sua troca com essa pessoa?</Text>
          <View style={styles.ContainerEstrelas}>
          {estrelas.map((estrela) => {
            const avaliacao = estrela <= (isRating ?? 0);
            return (
              <View key={estrela}>
                <Pressable onPress={() => setIsRating(estrela)} style={styles.estrelas} accessibilityRole="button" accessibilityLabel={`${estrela} ${estrela===1 ? "estrela":"estrelas"}`}>
                  <MaterialCommunityIcons
                    name="star"
                    size={32}
                    color={avaliacao ? "#e4a614" : "#a09f9f"}
                  />
                </Pressable>
              </View>
              
            );
          })}
          </View>
          <TextInput
            value={isNotes}
            placeholder="Adicione um comentário (max:200)"
            placeholderTextColor={theme.colors.textSecondary}
            onChangeText={setIsNotes}
            multiline
            editable={!isPending}
            maxLength={250}
            style={styles.input}
          />
        <View style={styles.containerBtns}>
        <Pressable onPress={() => onClose()} style={styles.btnCancelar} disabled={isPending}>
          <Text style={styles.textBtnCancelar}>Cancelar</Text>
        </Pressable>
          <Pressable onPress={handleAvaliar} disabled={isPending} style={styles.btnConfirmar}>
          <Text style={styles.textBtnConfirmar}>{isPending ? "Salvando..." : "Confirmar Avaliação"}</Text>
        </Pressable>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </Modal>
  );
} 
const styles= StyleSheet.create({
modalOverlay:{
flex: 1,
backgroundColor:"rgba(0,0,0,0.45)",
justifyContent: "center",
padding:theme.spacing.lg,
}, 
scrollContainer:{
  flexGrow:1, 
  justifyContent:"center", 
  paddingVertical:theme.spacing.md
}, 
modalContainer:{
width:"100%", 
maxWidth:420,
backgroundColor:theme.colors.surface, 
padding:theme.spacing.lg,
borderRadius:theme.borderRadius.lg,
borderWidth:1,
borderColor:theme.colors.border,
}, 
textCompletado:{
  fontSize:16, 
  color:theme.colors.textPrimary, 
  marginBottom:theme.spacing.lg
}, 
ContainerEstrelas:{
  flexDirection:"row", 
  justifyContent:"center", 
  alignItems:"center", 
  marginTop:theme.spacing.lg,
  marginBottom:theme.spacing.md
}, 
estrelas:{
  padding:theme.spacing.xs
},
input:{
  minHeight:110,
  textAlignVertical:"top", 
  backgroundColor:theme.colors.surface,
  borderColor:theme.colors.border,
  borderWidth:1,
  borderRadius:theme.borderRadius.md,
  padding:theme.spacing.md, 
  color:theme.colors.textPrimary,
  fontSize:14
}, 
btnConfirmar:{
minHeight:48,
backgroundColor:theme.colors.primary, 
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.md,
alignItems:"center",
justifyContent:"center"
}, 
textBtnConfirmar:{
color:theme.colors.surface
}, 
btnCancelar:{
minHeight:48, 
backgroundColor:theme.colors.error,  
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.md,
alignItems:"center", 
justifyContent:"center",
}, 
textBtnCancelar:{
color:theme.colors.surface
},
containerBtns:{
  flexDirection:"row",
  gap:theme.spacing.sm, 
  marginTop:theme.spacing.lg
}, 
titulo:{
  fontSize:20,
  fontWeight:"700", 
  color:theme.colors.textPrimary, 
  textAlign:"center"
}, 
subtitulo:{
  fontSize:14,
  color:theme.colors.textSecondary, 
  textAlign:"center", 
  marginTop:theme.spacing.xs
}
})
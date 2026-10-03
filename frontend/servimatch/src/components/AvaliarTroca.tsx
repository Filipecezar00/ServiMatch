import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { View, Modal, Text, Pressable, TextInput, Alert } from "react-native";
import { concluirTroca } from "../api/exchange";
import { AvaliarTrocaProps, FinalizarTroca } from "../types/exchangeTypes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export function AvaliarTroca({ visible, troca, onClose }: AvaliarTrocaProps) {
  const [isRating, setIsRating] = useState<number | null>(null);
  const [isNotes, setIsNotes] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation<
    FinalizarTroca,
    Error,
    FinalizarTroca
  >({
    mutationFn: concluirTroca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MinhasTrocas"] });
      Alert.alert("Concluido com Sucesso");
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

  const handleConfirmar = () => {
    if (!troca?.id) {
      return Alert.alert("Selecione uma troca");
    }
    if (!isRating) {
      return Alert.alert("Selecione uma nota de 1 a 5 estrelas");
    }

    mutate({
      id: troca.id,
      status: "completed",
      rating: isRating,
      notes: isNotes,
    });
  };

  const estrelas = [1, 2, 3, 4, 5];

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>Adicione uma nota</Text>

          {estrelas.map((estrela) => {
            const avaliacao = estrela <= (isRating ?? 0);
            return (
              <View key={estrela}>
                <Pressable onPress={() => setIsRating(estrela)}>
                  <MaterialCommunityIcons
                    name="star"
                    size={28}
                    color={avaliacao ? "#eef600" : "#a09f9f"}
                  />
                </Pressable>
              </View>
            );
          })}
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
        <Pressable onPress={handleConfirmar} disabled={isPending}>
          <Text>{isPending ? "Salvando..." : "Confirmar conclusão"}</Text>
        </Pressable>
        <Pressable onPress={() => onClose()}>
          <Text>Cancelar</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

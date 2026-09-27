import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  View,
  ActivityIndicator,
  Pressable,
  Text,
  ScrollView,
} from "react-native";
import { obterDetalhesServico } from "../../api/serviceWanted";

export function DetalhesServico() {
  const route = useRoute();
  const { id } = route.params as { id: number };

  const {
    data: detalhes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["detalhesServicos", id],
    queryFn: () => obterDetalhesServico(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !detalhes) {
    return (
      <View>
        <Text>Erro ao consultar detalhes do serviço : {error?.message}</Text>
        <Pressable onPress={() => refetch()}>
          <Text>Tente novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
        <Text>Detalhes do Serviço</Text>
        <View>
          <Text>{detalhes.titulo}</Text>
          <Text>{detalhes.descricao}</Text>
        </View>
      </ScrollView>

      <Pressable>
        <Text>Propor troca</Text>
      </Pressable>
    </View>
  );
}

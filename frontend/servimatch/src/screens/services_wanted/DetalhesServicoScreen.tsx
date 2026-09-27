import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  View,
  ActivityIndicator,
  Pressable,
  Text,
  Modal,
  ScrollView,
} from "react-native";
import { obterDetalhesServico } from "../../api/serviceWanted";
import { listaMeusServicos } from "../../api/serviceOffered";
import { FlatList } from "react-native-gesture-handler";

export function DetalhesServico() {
  const route = useRoute();
  const [modalVisual, setModalVisual] = useState(false);
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState<
    number | null
  >();
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

  const { data: servicos, isLoading: LoadingServices } = useQuery({
    queryKey: ["meusServicos"],
    queryFn: listaMeusServicos,
    enabled: modalVisual,
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

      <Pressable onPress={() => setModalVisual(true)}>
        <Text>Propor troca</Text>
      </Pressable>

      <Modal visible={modalVisual} onRequestClose={() => setModalVisual(false)}>
        <View>
          <Text>Realizar Troca de Servicos</Text>
          <View>
            <Text>Seus Serviços:</Text>
            {LoadingServices ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <Pressable
                onPress={(item: any) => setServicoSelecionadoId(item?.id)}
              >
                <FlatList
                  data={servicos}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        <View>
                          <Text>{item.titulo}</Text>
                          <Text>{item.descricao}</Text>
                        </View>
                      </View>
                    );
                  }}
                />
              </Pressable>
            )}
          </View>
        </View>
        <Pressable onPress={() => setModalVisual(false)}>
          <Text>Cancelar</Text>
        </Pressable>
        <Pressable>
          <Text>Enviar Proposta</Text>
        </Pressable>
      </Modal>
    </View>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listaMeusServicos,
  editarStatusServico,
} from "../../api/serviceOffered";
import {
  Alert,
  View,
  ActivityIndicator,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ServiceStackOfferedParamList } from "../../navigation/ServicesStack";
import { CompositeNavigationProp } from "@react-navigation/native";

export function MeusServicos() {
  type ListarServicosNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<
      ServiceStackOfferedParamList,
      "ListarMeusServicos"
    >,
    DrawerNavigationProp<any>
  >;

  const navigation = useNavigation<ListarServicosNavigationProp>();

  const queryClient = useQueryClient();
  const {
    data: servicos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Meus-servicos"],
    queryFn: () => listaMeusServicos(),
  });

  const { mutate } = useMutation({
    mutationFn: editarStatusServico,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["Meus-servicos"] });
    },
    onError(erro) {
      Alert.alert("Erro ao editar status:", erro.message);
    },
  });

  const handleSubmit = (id: number, statusAtual: boolean) => {
    mutate({ id, ativo: !statusAtual });
  };

  return (
    <View>
      <View>
        <Pressable onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} />
        </Pressable>
      </View>
      <View>
        <Pressable onPress={() => navigation.navigate("CriarServico")}>
          <MaterialCommunityIcons name="plus" size={18} />
          <Text>Criar novo serviço</Text>
        </Pressable>
      </View>
      {isError && (
        <View>
          <Text>Erro ao realizar operação</Text>
          <Pressable onPress={() => refetch()}>
            <Text>Tentar Novamente</Text>
          </Pressable>
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <FlatList
            data={servicos}
            keyExtractor={(servico) => servico.id.toString()}
            refreshing={isLoading}
            onRefresh={refetch}
            ListEmptyComponent={
              <Text>Você ainda não possui nenhum serviço cadastrado!</Text>
            }
            renderItem={({ item }) => (
              <View>
                <Text>Titulo: {item.titulo}</Text>
                <Text>Descrição: {item.descricao}</Text>
                <Text>Status Atual: {item.ativo ? "Ativo" : "Inativo"}</Text>
                <Pressable onPress={() => handleSubmit(item.id, item.ativo)}>
                  <Text>
                    {item.ativo ? "Desativar serviço" : "Ativar serviço"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditarServico", { id: item.id })
                  }
                >
                  <Text>Editar Serviço</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarServicoWanted,
  editarStatusServicoWanted,
} from "../../api/serviceWanted";
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ServiceStackWantedParamList } from "../../navigation/ServicesStack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export function ListarServicosProcurados() {
  type ListarServicosWantedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<
      ServiceStackWantedParamList,
      "ListarServicosProcurados"
    >,
    DrawerNavigationProp<any>
  >;

  const navigation = useNavigation<ListarServicosWantedNavigationProp>();
  const queryClient = useQueryClient();

  const {
    data: servicos = [],
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["listarServicosProcurados"],
    queryFn: () => listarServicoWanted(),
  });

  const { mutate } = useMutation({
    mutationFn: editarStatusServicoWanted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarServicosProcurados"] });
    },
    onError: (erro) => {
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
          <Pressable
            onPress={() => navigation.navigate("CriarServicoProcurado")}
          >
            <MaterialCommunityIcons name="plus" size={18} />
            <Text>Adicionar novo serviço desejado</Text>
          </Pressable>
          <FlatList
            data={servicos}
            refreshing={isLoading}
            onRefresh={refetch}
            ListEmptyComponent={
              <Text>
                Você ainda não possui nenhum serviço do seu interesse
                Cadastrado!
              </Text>
            }
            keyExtractor={(servico) => servico.id.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>Titulo: {item.titulo}</Text>
                <Text>Descrição: {item.descricao}</Text>
                <Text>Status Atual: {item.ativo ? "Ativo" : "Inativo"}</Text>
                <Pressable onPress={() => handleSubmit(item.id, item.ativo)}>
                  <Text>
                    {item.ativo ? "Desativar Serviço" : "Ativar Serviço"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditarServicoProcurado", {
                      id: item.id,
                    })
                  }
                >
                  <Text>Editar Serviço desejado</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

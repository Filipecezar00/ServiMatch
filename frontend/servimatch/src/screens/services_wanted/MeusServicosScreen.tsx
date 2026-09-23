import { useQuery } from "@tanstack/react-query";
import { listarServicoWanted } from "../../api/serviceWanted";
import { View, ActivityIndicator, Text, FlatList } from "react-native";

export function ListarServicosProcurados() {
  const {
    data: servicos,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listarServicosProcurados"],
    queryFn: listarServicoWanted,
  });

  return (
    <View>
      {isError && <Text>{error.message}</Text>}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={servicos}
          ListEmptyComponent={
            <Text>
              Você ainda não possui nenhum serviço do seu interesse Cadastrado!
            </Text>
          }
          keyExtractor={(servico) => servico.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>Titulo: {item.titulo}</Text>
              <Text>Descrição: {item.descricao}</Text>
              <Text>Status Atual: {item.ativo ? "Ativo" : "Inativo"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

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
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ServiceStackOfferedParamList } from "../../navigation/ServicesStack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { theme } from "../../styles/theme/theme";

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
    <View style={styles.container}>
      <View>
        <Pressable onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} />
        </Pressable>
      </View>
      <View style={styles.containerCriarServico}>
        <Pressable onPress={() => navigation.navigate("CriarServico")} style={styles.botaoCriar}>
          <MaterialCommunityIcons name="plus" size={18} color={theme.colors.surface}/>
          <Text style={styles.textCriarServico}>Criar novo serviço</Text>
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

const styles = StyleSheet.create({
container:{
  flex:1, 
  backgroundColor:theme.colors.background, 
  padding:theme.spacing.lg
},
containerCriarServico:{
}, 
botaoCriar:{
flexDirection:"row",
gap:theme.spacing.xs,
paddingBottom:theme.spacing.xs,
backgroundColor:theme.colors.primary, 
borderWidth:1,
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.md,
justifyContent:"center",
alignItems:"center",
borderRadius:theme.spacing.xs

}, 
textCriarServico:{
textAlign:"center",
fontSize:14,
color:theme.colors.surface,
paddingVertical:theme.spacing.xs
}
})
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarCategorias,
  obterDetalhesServicoPorId,
  editarServico,
} from "../../api/serviceOffered";
import { theme } from "../../styles/theme/theme";
import { ServiceStackOfferedParamList } from "../../navigation/ServicesStack";
export function EditarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: categorias, isLoading } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: editarServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Meus-servicos"] });
      navigation.goBack();
    },
    onError: (error) => {
      setErroLocal(`Erro ao realizar mutate: ${error.message}`);
    },
  });

  type EditarServicoRouteProp = RouteProp<
    ServiceStackOfferedParamList,
    "EditarServico"
  >;

  const route = useRoute<EditarServicoRouteProp>();
  const { id } = route.params;

  const { data: servico } = useQuery({
    queryKey: ["servico", id],
    queryFn: () => obterDetalhesServicoPorId(id),
    enabled: !!id,
  });

  const handleSubmit = () => {
    setErroLocal("");
    if (!titulo || titulo.trim().length < 5) {
      return setErroLocal(
        "O campo de titulo deve possuir no mínimo cinco caracteres",
      );
    }
    if (!descricao || descricao.trim().length < 10) {
      return setErroLocal(
        "O campo de descrição deve possuir no mínimo dez caracteres",
      );
    }

    if (categoryId == null) {
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }

    mutate({ id, titulo, descricao, categoryId });
  };

  useEffect(() => {
    if (servico) {
      setTitulo(servico.titulo);
      setDescricao(servico.descricao);
      setCategoryId(servico.categoryId);
    }
  }, [servico]);

  return (
    <View style={styles.container}>
      {erroLocal && (
        <View style={styles.errorBox}>
          <Text style={styles.textError}>Erro ao editar serviço: {erroLocal}</Text>
        </View>
      )}
      <View style={styles.containerVoltar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={theme.colors.textPrimary}/>
          <Text style={styles.textVoltar}>Voltar</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.titleHeader}>Edite seu serviço</Text>
        <Text style={styles.descriptionHeader}>Preencha os campos abaixo</Text>
      </View>

    <ScrollView contentContainerStyle={styles.containerEdicao}>
      <Text style={styles.titulo}>Editar titulo</Text>
      <TextInput
        placeholder="Digite o titulo"
        value={titulo}
        onChangeText={setTitulo}
        autoCapitalize="sentences"
        maxLength={200}
        style={styles.input}
      />

      <Text style={styles.titulo}>Editar descrição</Text>
      <TextInput
        placeholder="Digite a descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        maxLength={1000}
        style={styles.inputDescricao}
      />

      <Text style={styles.titulo}>Editar Categoria</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.surface}/>
      ) : (
        <View>
          {categorias?.map((categoria) => {
            const isSelected = categoria.id === categoryId;
            return (
              <View
                key={categoria.id}
                style={{
                  backgroundColor: isSelected ? "#007AFF" : "#e5e5ea",
                  borderColor: isSelected ? "#0056b3" : "#c7c7cc",
                }}
              >
                <Pressable onPress={() => setCategoryId(categoria.id)} style={({pressed})=>[styles.categoriaButton,pressed && {opacity:0.5}, isSelected && styles.categoriaSelecionada]}>
                  <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
      <Pressable onPress={handleSubmit} disabled={isPending||isLoading || categorias?.length===0} style={styles.buttonEditar}>
          {isPending ? <ActivityIndicator size="small" color={theme.colors.surface}/> : <Text style={styles.editarText}>Editar Serviço</Text>}
      </Pressable>
    </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
container:{
  flex:1, 
  backgroundColor:theme.colors.background,
  padding:theme.spacing.lg, 
}, 
containerVoltar:{
flexDirection:"row",
paddingBottom:theme.spacing.md
}, 
botaoVoltar:{
flexDirection:"row", 
alignItems:"center", 
gap:theme.spacing.xs
},
textVoltar:{
paddingVertical:theme.spacing.xs
},
header:{
alignItems:"center",
justifyContent:"center",
marginBottom:theme.spacing.md 
}, 
titleHeader:{
fontSize:20,
fontWeight:"700",
color:theme.colors.primaryDark,
marginBottom:theme.spacing.xs
}, 
descriptionHeader:{
fontSize:16,
fontWeight:"400",
color:theme.colors.textSecondary,
},
errorBox:{
  backgroundColor:theme.colors.error,
  padding:theme.spacing.sm,
  borderRadius:theme.borderRadius.sm,
  marginBottom:theme.spacing.md
},
textError:{
  color:theme.colors.surface,
  fontSize:14,
  fontWeight:"500"
}, 
titulo:{
fontSize:16,
fontWeight:"600",
color:theme.colors.textPrimary,
marginBottom:theme.spacing.xs
}, 
containerEdicao:{
flexDirection:"column",
marginTop:theme.spacing.md,
}, 
input:{
marginBottom:theme.spacing.md,
backgroundColor:theme.colors.surface,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.sm,
borderWidth:1,
minHeight:48,
borderColor:theme.colors.border 
}, 
inputDescricao:{
  marginBottom:theme.spacing.md,
  backgroundColor:theme.colors.surface,
  paddingHorizontal:theme.spacing.md,
  paddingVertical:theme.spacing.sm,
  borderRadius:theme.borderRadius.sm,
  borderWidth:1,
  borderColor:theme.colors.border,
  minHeight:150
},
categoriaButton:{
marginBottom:theme.spacing.sm,
backgroundColor:theme.colors.surface,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.sm,
borderWidth:1,
borderColor:theme.colors.border
},
categoriaSelecionada:{
  borderColor:theme.colors.primaryDark,
}, 
buttonEditar:{
marginTop:theme.spacing.md,
backgroundColor:theme.colors.primary,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.sm,
alignItems:"center",
justifyContent:"center",
minHeight:48
}, 
editarText:{
fontSize:16,
fontWeight:"600",
color:theme.colors.surface  
},
categoriaNome:{
fontSize:14,
fontWeight:"400",
color:theme.colors.textPrimary,
},  
})
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  editarServicoWanted,
  obterServicoWantedId,
  listarCategorias,
} from "../../api/serviceWanted";
import { useState, useEffect } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { ServiceStackWantedParamList } from "../../navigation/ServicesStack";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import { theme } from "../../styles/theme/theme"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export function EditarServicoWanted() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");

  type EditarServicoWantedRouter = RouteProp<
    ServiceStackWantedParamList,
    "EditarServicoProcurado"
  >;
  const route = useRoute<EditarServicoWantedRouter>();
  const { id } = route.params;
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [campoAtivo,setCampoAtivo] = useState<"titulo" | "descricao" | null> (null)
  const {
    data: categorias,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { data: servico } = useQuery({
    queryKey: ["servicoWanted", id],
    queryFn: () => obterServicoWantedId(id),
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["editarServicoWanted"],
    mutationFn: editarServicoWanted,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarServicosProcurados"] });
      navigation.goBack();
    },
    onError: (erro: Error) => {
      setErroLocal(erro.message);
    },
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
    if (!categoryId) {
      return setErroLocal("Preencha uma categoria antes de criar o serviço");
    }

    mutate({ id, titulo, descricao, categoryId: categoryId });
  };

  useEffect(() => {
    if (servico) {
      setTitulo(servico.titulo);
      setDescricao(servico.descricao);
      setCategoryId(servico.categoryId);
    }
  }, [servico]);
  return (
  <KeyboardAvoidingView behavior={Platform.OS==="ios" ? "padding":"height"} style={styles.container}>
    <View>
      {erroLocal && (
        <View style={styles.errorBox}>
          <Text style={styles.textError}>Erro ao Editar serviço: {erroLocal}</Text>
        </View>
      )}

    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.containerVoltar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <MaterialCommunityIcons name="arrow-left" size={18} />
          <Text style={styles.textVoltar}>Voltar</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
      <Text style={styles.titleHeader}>Edite o serviço procurado</Text>
      <Text style={styles.descriptionHeader}>Preencha os campos abaixo</Text>
      </View>

      <Text style={styles.titulo}>Editar Titulo</Text>
      <TextInput
        placeholder="Digite o titulo"
        value={titulo}
        onChangeText={setTitulo}
        onFocus={()=>setCampoAtivo("titulo")}
        onChange={()=>setCampoAtivo(null)}
        autoCapitalize="sentences"
        maxLength={200}
        style={[styles.input,campoAtivo=="titulo" && styles.inputAtivo]}
      />

      <Text style={styles.titulo}>Editar a Descrição</Text>
      <TextInput
        placeholder="Digite a Descrição"
        value={descricao}
        onChangeText={setDescricao}
        maxLength={1000}
        multiline
        onFocus={()=>setCampoAtivo("descricao")}
        onBlur={()=>setCampoAtivo(null)}
        textAlignVertical="top"
        autoCapitalize="sentences"
        style={[styles.inputDescricao,campoAtivo=="descricao" && styles.inputAtivo]}

      />

      <Text style={styles.titulo}>Editar Categoria</Text>
      {isLoading ? (
        <ActivityIndicator size={'small'} color={theme.colors.primaryDark}/>
      ) : (
        categorias?.map((categoria) => {
          const isSelected = categoria.id === categoryId;
          return (
            <View
              key={categoria.id}
            >
              <Pressable onPress={() => setCategoryId(categoria.id)} style={({pressed})=>[styles.btnCategoria,pressed && {opacity:0.5} , isSelected && styles.categoriaSelecionada ]}>
                <Text style={styles.categoriaNome}>{categoria.nome}</Text>
              </Pressable>
            </View>
          );
        })
      )}
      <Pressable onPress={handleSubmit} disabled={isPending} style={styles.btnConfirmar}>
        {isPending ? (
          <ActivityIndicator size={"small"} color={theme.colors.primaryDark} />
        ) : (
          <Text style={styles.textBtnConfirmar}>Confirmar</Text>
        )}
      </Pressable>
     </ScrollView>
    </View>
  </KeyboardAvoidingView>
    
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
  flexDirection:'row', 
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
color:theme.colors.textSecondary
}, 
titulo:{
fontSize:16,
fontWeight:"600",
color:theme.colors.textPrimary,
marginBottom:theme.spacing.xs
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
inputAtivo:{
  borderColor:theme.colors.primaryDark
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
btnCategoria:{
marginBottom:theme.spacing.sm,
backgroundColor:theme.colors.surface,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.sm,
borderWidth:1,
borderColor:theme.colors.border
}, 
categoriaSelecionada:{
borderColor:theme.colors.primaryDark
}, 
categoriaNome:{
fontSize:14,
fontWeight:"400",
color:theme.colors.textPrimary,
}, 
btnConfirmar:{
marginTop:theme.spacing.md,
backgroundColor:theme.colors.primary,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.sm,
alignItems:"center",
justifyContent:"center",
minHeight:48
}, 
textBtnConfirmar:{
fontSize:16,
fontWeight:"600",
color:theme.colors.surface  
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
})
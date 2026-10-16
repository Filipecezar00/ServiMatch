import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarServicoWanted, listarCategorias } from "../../api/serviceWanted";
import { useState } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme/theme"; 
import { useNavigation } from "@react-navigation/native";

export function CriarServicoWanted() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");

  const navigation = useNavigation();

  const queryClient = useQueryClient();
  const {
    data: categorias,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: criarServicoWanted,
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
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }

    mutate({ titulo, descricao, categoryId: categoryId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerVoltar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <MaterialCommunityIcons name="arrow-left" size={18} />
          <Text style={styles.textVoltar}>Voltar</Text>
        </Pressable>
      </View>
      {erroLocal.length > 0 && <Text style={styles.textError}>{erroLocal}</Text>}

       <View style={styles.header}>
        <Text style={styles.titleHeader}>Criar Serviço</Text>
        <Text style={styles.descriptionHeader}>Descreva o serviço que você procura</Text>
       </View>
      <Text style={styles.titulo}>Titulo do Serviço</Text>
      <TextInput
        placeholder="Digite o titulo"
        value={titulo}
        onChangeText={setTitulo}
        autoCapitalize="sentences"
        maxLength={200}
        style={styles.input}
      />

      <Text style={styles.titulo}>Descrição do Serviço</Text>
      <TextInput
        placeholder="Digite a Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        style={styles.inputDescricao}
        maxLength={1000}
      />

      <Text style={styles.titulo}>Categorias Disponiveis</Text>
      <View style={styles.containerCategorias}>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.surface}/>
        ) : (
          categorias?.map((categoria) => {
            const isSelected = categoria.id === categoryId;
            return (
              <View
                key={categoria.id}
               >
                <Pressable onPress={() => setCategoryId(categoria.id)} style={({pressed})=>[styles.categoriaButton,pressed && {opacity:0.5},isSelected && styles.categoriaSelecionada]}>
                  <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>
      <Pressable onPress={handleSubmit} disabled={isPending} style={styles.buttonCadastrar}>
        {isPending ? (
          <ActivityIndicator size="small" color={theme.colors.surface}/>
        ) : (
          <Text style={styles.cadastrarText}>Cadastrar Serviço</Text>
        )}
      </Pressable>
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
    paddingBottom:theme.spacing.md,
  }, 
  botaoVoltar:{
    flexDirection:"row",
    alignItems:"center",
    gap:theme.spacing.xs,
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
  containerEdicao:{
    flexDirection:"column",
    marginTop:theme.spacing.md,
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
  containerCategorias:{

  }, 
  mensagemCategoria:{
  color:theme.colors.primaryDark, 
  textAlign:"center",
  fontSize:14, 
  marginBottom:theme.spacing.md
  }, 
  categoriaNome:{
    fontSize:14,
    fontWeight:"400",
   color:theme.colors.textPrimary,
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
  buttonCadastrar:{
    marginTop:theme.spacing.md,
    backgroundColor:theme.colors.primary,
    paddingHorizontal:theme.spacing.md,
    paddingVertical:theme.spacing.sm,
    borderRadius:theme.borderRadius.sm,
    alignItems:"center",
    justifyContent:"center",
    minHeight:48
  }, 
  cadastrarText:{
    fontSize:16,
    fontWeight:"600",
    color:theme.colors.surface  
  }
})
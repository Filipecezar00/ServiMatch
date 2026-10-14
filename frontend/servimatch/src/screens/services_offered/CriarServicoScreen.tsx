import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { criarServico, listarCategorias } from "../../api/serviceOffered";
import {
  Pressable,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import{ theme } from "../../styles/theme/theme";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function CriarServicoScreen() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const {
    data: categorias,
    isLoading,
    isError: isErrorCategorias,
  } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: criarServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeAtivos"] });

      navigation.navigate("Home");
    },
  });

  function handleSubmit() {
    setErroLocal("");
    if (!titulo.trim() || titulo.trim().length < 5) {
      return setErroLocal(
        "O campo de titulo deve possuir no mínimo cinco caracteres",
      );
    }

    if (!descricao.trim() || descricao.trim().length < 10) {
      return setErroLocal(
        "O campo de descrição deve possuir no mínimo dez caracteres",
      );
    }

    if (categoryId === null) {
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }

    mutate({ titulo, descricao, categoryId: categoryId });
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerVoltar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={theme.colors.textPrimary} />
          <Text style={styles.textVoltar}>Voltar</Text>
        </Pressable>
      </View>
        <View style={styles.header}>
        <Text style={styles.titleHeader}>Criar Serviço</Text>
        <Text style={styles.descriptionHeader}>Descreva o serviço que você oferece</Text>
      </View>
      {isError && <Text>{error?.message}</Text>}
      {erroLocal && <Text>{erroLocal}</Text>}
    <ScrollView style={styles.containerEdicao}>
      <Text style={styles.titulo}>Titulo do Serviço</Text>
      <TextInput
        placeholder="Digite o Titulo"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />

      <Text style={styles.titulo}>Descrição do Serviço</Text>
      <TextInput
        placeholder="Digite a Descrição"
        multiline
        textAlignVertical="top"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.inputDescricao}
        maxLength={1000}
      />

      <Text style={styles.titulo}>Categorias Disponiveis</Text>
      <View style={styles.containerCategorias}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          categorias?.map((categoria) => {
            const isSelected = categoria.id === categoryId;
            return (
              <View
                key={categoria.id}
                style={styles.categoriaItem}
              >
                <Pressable onPress={() => setCategoryId(categoria.id)} style={({pressed})=>[styles.categoriaButton,pressed && {opacity:0.5}, isSelected && styles.categoriaSelecionada]}>
                  <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>

      <Pressable onPress={handleSubmit} disabled={isPending} style={styles.buttonCadastrar}>
        {isPending ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.cadastrarText}>Cadastrar Serviço</Text>
        )}
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
paddingBottom:theme.spacing.md,

}, 
containerEdicao:{
flexDirection:"column",
marginTop:theme.spacing.md,
}, 
containerCategorias:{

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
  minHeight:100
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
buttonCadastrar:{
marginTop:theme.spacing.md,
backgroundColor:theme.colors.primary,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.sm,
alignItems:"center",
justifyContent:"center"
}, 

categoriaItem:{
fontSize:14,
fontWeight:"400",
color:theme.colors.textPrimary,
}, 
categoriaNome:{

}, 
cadastrarText:{
fontSize:16,
fontWeight:"600",
color:theme.colors.surface  
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
marginBottom:theme.spacing.md
},
categoriaSelecionada:{
  borderColor:theme.colors.primaryDark,
}, 
botaoVoltar:{
flexDirection:"row",
alignItems:"center",
gap:theme.spacing.xs,
}, 
textVoltar:{
paddingVertical:theme.spacing.xs,

}


})
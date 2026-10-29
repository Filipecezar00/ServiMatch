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
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useState } from "react";
import{ theme } from "../../styles/theme/theme";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; 
import { Image } from "react-native";

export function CriarServicoScreen() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imagens,setImagens] = useState<ImagePicker.ImagePickerAsset[]>([]); 
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
    onSuccess: (dados) => {
      console.log("Serviço criado com sucesso:",dados); 
      queryClient.invalidateQueries({ queryKey: ["homeAtivos"] });

      navigation.getParent()?.navigate("HomeStack",{
        screen:"Home"
      });
    },onError:(erro)=>{
      console.log("Erro ao criar serviço:",erro); 
    }
  });

  async function selecionarImagem(){
    if(imagens.length>=3){
      setErroLocal("Você pode selecionar no máximo 3 imagens"); 
      return; 
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:["images"],
      allowsMultipleSelection:true,
      selectionLimit:3 - imagens.length, 
      quality:0.8, 
    }); 

    if(!resultado.canceled){
      const novasImagens = resultado.assets; 
      setImagens((imagensAtuais)=>[
        ...imagensAtuais,
        ...novasImagens, 
      ].slice(0,3)); 
      setErroLocal(""); 
    }
  }

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

    mutate({ titulo:titulo.trim(), descricao:descricao.trim(), categoryId: categoryId,imagens:imagens });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS ==="ios" ? "padding" : 
      undefined
    }>
    <View style={styles.conteudoPrincipal}>
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

      {isError &&
      <View style={styles.errorBox}>
        <Text style={styles.textError}>{error?.message}</Text>
      </View>
      }
      {erroLocal &&
      <View style={styles.errorBox}>
          <Text style={styles.textError}>{erroLocal}</Text>
      </View>
      }

    <ScrollView
     style={styles.scrollFormulario}
     contentContainerStyle={styles.containerEdicao}
     keyboardShouldPersistTaps="handled"
     showsVerticalScrollIndicator={true}
     nestedScrollEnabled={true}
     >
      <Text style={styles.titulo}>Titulo do Serviço</Text>
      <TextInput
        placeholder="Digite o Titulo"
        value={titulo}
        autoCapitalize="sentences"
        maxLength={200}
        onChangeText={setTitulo}
        style={styles.input}
      />

      <Text style={styles.titulo}>Descrição do Serviço</Text>
      <TextInput
        placeholder="Digite a Descrição"
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.inputDescricao}
        maxLength={1000}
      />

      <Text style={styles.titulo}>Categorias Disponiveis</Text>
      <View style={styles.containerCategorias}>
        {isLoading ? (
          <ActivityIndicator  size="small" color={theme.colors.surface}/>
        ):isErrorCategorias ?(
          <Text style={styles.mensagemCategoria}>Não foi possível carregar as categorias</Text>
        ): categorias?.length===0?(
          <Text style={styles.mensagemCategoria}>Nenhuma categoria disponivel no momento</Text>
        ):(
          categorias?.map((categoria) => {
            const isSelected = categoria.id === categoryId;
            return (
              <View
                key={categoria.id}
              >
                <Pressable onPress={() => setCategoryId(categoria.id)} style={({pressed})=>[styles.categoriaButton,pressed && {opacity:0.5}, isSelected && styles.categoriaSelecionada]}>
                  <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>

      <Text style={styles.titulo}>Imagens do serviço</Text>
      <Pressable onPress={selecionarImagem} style={[styles.buttonImage, imagens.length>=3 && {opacity:0.5}]} disabled={imagens.length>=3}>
          <MaterialCommunityIcons name="image-plus" size={22} color={theme.colors.primary}/>  
          <Text style={styles.textBotaoImagem}>
            {imagens.length>=3? 'Limite de imagens atingido':'Selecionar Imagens'}
          </Text>
      </Pressable>
      {imagens&&(
        <View style={styles.containerImagens}>
        {imagens.map((imagem,index)=>(
        <View key={`${imagem.uri}-${index}`} style={styles.itemImagem}>
         <Image source={{uri:imagem.uri}}
          style={styles.previewImagem}
          resizeMode="cover"
          />
        <Pressable onPress={()=>setImagens((imagensAtuais)=>imagensAtuais.filter((_,i)=>i!==index))} style={styles.botaoRemoverImagem}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={theme.colors.error}/>
            <Text style={styles.textRemoverImagem}>Remover imagem</Text>
        </Pressable>
          </View>
          ))}
        <Text style={styles.contadorImagens}>
        {imagens.length}/3 imagens selecionadas
        </Text>
        </View>
      )}

      <Pressable onPress={handleSubmit} disabled={isPending || isLoading || isErrorCategorias || categorias?.length===0} style={styles.buttonCadastrar}>
        {isPending ? (
          <ActivityIndicator size="small" color={theme.colors.surface} />
        ) : (
          <Text style={styles.cadastrarText}>Cadastrar Serviço</Text>
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
}, 
containerVoltar:{
flexDirection:"row",
paddingBottom:theme.spacing.md,

}, 
containerEdicao:{
paddingTop:theme.spacing.md, 
paddingBottom:40,
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
categoriaNome:{
fontSize:14,
fontWeight:"400",
color:theme.colors.textPrimary,
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
mensagemCategoria:{
  color:theme.colors.primaryDark, 
  textAlign:"center",
  fontSize:14, 
  marginBottom:theme.spacing.md
},
buttonImage:{
flexDirection:"row",
alignItems:"center", 
justifyContent:"center", 
gap:theme.spacing.sm,
backgroundColor:theme.colors.surface, 
padding:theme.spacing.md, 
borderRadius:theme.borderRadius.md,
marginBottom:theme.spacing.md
}, 
textBotaoImagem:{
color:theme.colors.primary,
fontSize:15,
fontWeight:"600"
}, 
previewImagem:{
width:"100%", 
height:200, 
borderRadius:theme.borderRadius.md,
backgroundColor:theme.colors.border
}, 
botaoRemoverImagem:{
flexDirection:"row", 
alignItems:"center", 
alignSelf:"flex-end", 
gap:theme.spacing.xs, 
paddingVertical:theme.spacing.sm,
},
textRemoverImagem:{
 color:theme.colors.error,
 fontSize:14,
 fontWeight:"500"
},
containerImagens: {
gap:theme.spacing.md, 
marginBottom:theme.spacing.sm
}, 
itemImagem:{
  backgroundColor:theme.colors.surface,
  borderRadius:theme.borderRadius.md, 
  padding:theme.spacing.sm,
  borderWidth:1, 
  borderColor:theme.colors.border
}, 
contadorImagens:{
fontSize:13, 
color:theme.colors.textSecondary, 
marginBottom:theme.spacing.sm
}, 
conteudoPrincipal:{
  flex:1, 
  paddingHorizontal:theme.spacing.lg,
  paddingTop:theme.spacing.lg
},
scrollFormulario:{
  flex:1
}
})
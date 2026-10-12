import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
  ScrollView,
  Platform
} from "react-native";
import {theme} from "../../styles/theme/theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/types";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../api/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;
export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [emailFocused,setEmailFocused] = useState(false)
  const [nomeFocused,setNomeFocused] = useState(false); 
  const [mostrarSenha,setMostrarSenha] = useState(false); 
  const [senhaFocused,setSenhaFocused] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    setErrorMessage("");

    if (!email || !email.trim()) {
      return setErrorMessage("É necessário adicionar um Email");
    }

    if (!nome || nome.trim().length < 3) {
      return setErrorMessage("O nome deve possuir no mínimo 3 caracteres");
    }

    if (!senha || senha.length < 8) {
      return setErrorMessage("A senha deve possuir no mínimo 8 caracteres");
    }
    setLoading(true);
    try {
      await register(email, nome, senha);

      Alert.alert(
        "Conta criada com sucesso!",
        "Realize o login para acessar sua conta.",
        [
          {
            text: "Ir para login",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro inesperado!");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} style={styles.keyboardContainer}>
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.brand}>ServiMatch</Text>
        <Text style={styles.title}>Crie sua Conta</Text>
        <Text style={styles.subtitle}>Cadastre-se para começar a conectar pessoas e serviços.</Text>
      </View>
      <View style={styles.formCard}>
        {errorMessage ?(
          <View style={styles.errorBox}>
           <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ):null}
      <View style={styles.fieldGroup}>
       <Text style={styles.label}>E-mail</Text>
        <TextInput
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          style={[styles.input,emailFocused && styles.inputFocused]}
        />
         </View>
         <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput placeholder="Digite seu nome" value={nome} onChangeText={setNome} style={[styles.input,nomeFocused && styles.inputFocused]} editable={!loading} />
         </View>

    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Senha</Text>
      <View style={[styles.passwordContainer,senhaFocused && styles.inputFocused]}>
        <TextInput
          placeholder="Digite sua senha"
          value={senha}
          secureTextEntry={!mostrarSenha}
          onChangeText={setSenha}
          onFocus={()=>setSenhaFocused(true)}
          onBlur={()=>setSenhaFocused(false)}
          style={styles.passwordInput}
          editable={!loading}
          returnKeyType="done"
          autoComplete="current-password"
        />
        <Pressable onPress={()=>setMostrarSenha((prev)=>!prev)}
          style={styles.eyeButton}
          hitSlop={8}
          accessibilityRole="button"
          >
            {mostrarSenha===true?(
              <MaterialCommunityIcons name="eye-off" size={18}/>
            ):(
              <MaterialCommunityIcons name="eye" size={18}/>
            )}
        </Pressable>
      </View>
      </View>


        <Pressable onPress={handleRegister} disabled={loading} accessibilityRole="button" style={({pressed})=>[styles.primarybutton,pressed && !loading && styles.primaryButtonPressed,loading && styles.primaryButtonDisabled,]}>
          {loading ? <ActivityIndicator color={theme.colors.surface}/> : <Text style={styles.primarybuttonText}>Cadastrar</Text>}
        </Pressable>
      <View style={styles.loginContainer}>
        <Pressable onPress={() => navigation.navigate("Login")} style={styles.secondaryButton} disabled={loading} accessibilityRole="button" hitSlop={8} >
          <Text style={styles.linkText}>Já Possuo conta</Text>
        </Pressable>
      </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  scrollContent:{
  flexGrow:1,
  justifyContent:"center",
  paddingHorizontal:theme.spacing.lg,
  paddingVertical:theme.spacing.xl
  }, 
  header:{
    alignItems:'center', 
    marginBottom:theme.spacing.xl
  },
  brand:{
    fontSize:18,
    fontWeight:"700",
    color:theme.colors.primary,
    marginBottom:theme.spacing.lg,
    letterSpacing:0.5
  }, 
  title:{
    fontSize:28,
    fontWeight:"700", 
    color:theme.colors.textPrimary, 
    textAlign:'center', 
  },
  subtitle:{
    fontSize:15,
    color:theme.colors.textSecondary, 
    textAlign:'center', 
    lineHeight:22,
    maxWidth:300
  }, 
  formCard:{
    backgroundColor:theme.colors.surface, 
    borderRadius:theme.borderRadius.lg, 
    padding:theme.spacing.lg, 
    borderWidth:1,
    borderColor:theme.colors.border
  }, 
  loginContainer:{
    flexDirection:"row",
    flexWrap:"wrap",
    alignItems:"center",
    marginTop:theme.spacing.xl,
    gap:theme.spacing.xs,
    justifyContent:'center',
  },
  keyboardContainer:{
    flex:1,
    backgroundColor:theme.colors.background
  }, 
  fieldGroup:{
    marginBottom:theme.spacing.md
  }, 
  label:{
    fontSize:14,
    fontWeight:"600", 
    color:theme.colors.textPrimary,
    marginBottom:theme.spacing.sm
  }, 
  input:{
    backgroundColor:theme.colors.background,
    borderWidth:1,
    borderColor:theme.colors.border,
    borderRadius:theme.borderRadius.md,
    paddingHorizontal:theme.spacing.md,
    paddingVertical:theme.spacing.md,
    minHeight:52,
    marginBottom:theme.spacing.md,
    color:theme.colors.textPrimary,
    fontSize:16,
    flex:1
  }, 
  inputFocused:{
    borderColor:theme.colors.primary,
    borderWidth:2
  },
  passwordContainer:{
    flexDirection:"row", 
    alignItems:"center", 
    backgroundColor:theme.colors.background, 
    borderWidth:1, 
    borderColor:theme.colors.border,
    borderRadius:theme.colors.border,
    paddingHorizontal:theme.spacing.md,
    minHeight:52, 
    marginBottom:theme.spacing.md
  }, 
  passwordInput:{
    flex:1,
    color:theme.colors.textPrimary, 
    fontSize:16,
    paddingVertical:theme.spacing.md
  },
  eyeButton:{
    paddingLeft:theme.spacing.sm
  }, 
  primarybutton:{
    backgroundColor:theme.colors.primary, 
    minHeight:52, 
    paddingHorizontal:theme.spacing.md,
    paddingVertical:theme.spacing.md, 
    borderRadius:theme.spacing.md, 
    alignItems:"center", 
    justifyContent:"center", 
    marginTop:theme.spacing.sm
  }, 
  primaryButtonPressed:{
    opacity:0.85,
  }, 
  primaryButtonDisabled:{
    opacity:0.65,
  }, 
  primarybuttonText:{
    color:theme.colors.surface, 
    fontWeight:"700", 
    fontSize:16
  },
  secondaryButton:{
  alignItems:'center', 
  marginTop:theme.spacing.lg
  },
  linkText:{
    color:theme.colors.primary, 
    fontWeight:"700", 
    fontSize:14, 
  }, 
  errorBox:{
    backgroundColor:"#FDE8E8", 
    borderWidth:1, 
    borderColor:theme.colors.error, 
    borderRadius:theme.borderRadius.md, 
    padding:theme.spacing.md, 
    marginBottom:theme.spacing.md,
    color:theme.colors.textPrimary, 
    fontSize:16, 
    flex:1
  },
  errorText:{
    color:theme.colors.error,
    fontSize:14,
    lineHeight:20,
    textAlign:"center"
  }
})
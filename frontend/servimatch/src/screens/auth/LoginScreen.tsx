import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView
} from "react-native";
import { login } from "../../api/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/types";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../stores/useAuthStore";
import {theme} from "../../styles/theme/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons";
type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailFocused,setEmailFocused] = useState(false); 
  const [senhaFocused,setSenhaFocused] = useState(false); 
  const [mostrarSenha,setMostrarSenha] = useState(false)

  const global_session = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !email.trim()) {
      return setErrorMessage("É necessário adicionar um Email");
    }

    if (!senha || senha.length < 8) {
      return setErrorMessage("A senha precisa ter no mínimo 8 caracteres");
    }
    setLoading(true);
    try {
      const req_login = await login(email, senha);

      global_session(req_login.usuario, req_login.token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation<LoginScreenNavigationProp>();
  return (
    <KeyboardAvoidingView behavior={Platform.OS==="ios" ? "padding":"height"} style={styles.keyboardContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
     <View style={styles.header}>
       <Text style={styles.brand}>ServiMatch</Text>
       <Text style={styles.title}>Bem vindo de Volta</Text>
       <Text style={styles.subtitle}>Entre para continuar conectando pessoas e serviços</Text>
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
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          onFocus={()=>setEmailFocused(true)}
          onBlur={()=>setEmailFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!loading}
          returnKeyType="next"
          style={[styles.input,emailFocused && styles.inputFocused]}
        />
         </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={[styles.passwordContainer,senhaFocused && styles.inputFocused]}>
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor={theme.colors.textSecondary}
          value={senha}
          secureTextEntry={!mostrarSenha}
          onFocus={()=>setSenhaFocused(true)}
          onBlur={()=>setSenhaFocused(false)}
          onChangeText={setSenha}
          autoCapitalize="none"
          autoComplete="current-password"
          style={styles.passwordInput}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
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

        <Pressable onPress={handleLogin} disabled={loading} accessibilityRole="button" style={({pressed})=>[
          styles.primarybutton,
          pressed && !loading && styles.primaryButtonPressed,
          loading && styles.primaryButtonDisabled, 
        ]}>
          {loading ? <ActivityIndicator color={theme.colors.surface}/> : <Text style={styles.primarybuttonText}>Entrar</Text>}
        </Pressable>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
              Ainda não tem conta ?
          </Text>
        </View>
        <Pressable onPress={() => navigation.navigate("Register")} style={styles.secondaryButton} disabled={loading} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.linkText}>Cadastre-se</Text>
        </Pressable>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
keyboardContainer:{
flex:1,
backgroundColor:theme.colors.background
},  
scrollContent:{
flexGrow:1,
justifyContent:"center", 
paddingHorizontal:theme.spacing.lg, 
paddingVertical:theme.spacing.xl, 
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
container:{
  flex:1,
  backgroundColor:theme.colors.background,
  justifyContent:'center',
  padding:theme.spacing.lg,
},
title:{
  fontSize:28,
  fontWeight:"700",
  color:theme.colors.textPrimary,
  textAlign:"center",
  marginBottom:theme.spacing.sm, 
}, 
subtitle:{
  fontSize:15,
  color:theme.colors.textSecondary, 
  textAlign:"center", 
  lineHeight:22,
  maxWidth:300,
}, 
formCard:{
  backgroundColor:theme.colors.surface, 
  borderRadius:theme.borderRadius.lg, 
  padding:theme.spacing.lg,
  borderWidth:1,
  borderColor:theme.colors.border
}, 
fieldGroup:{
  marginBottom:theme.spacing.md,
}, 
label:{
  fontSize:14,
  fontWeight:"600",
  color:theme.colors.textPrimary, 
  marginBottom:theme.spacing.sm
}, 

errorBox:{
  backgroundColor:"#FDE8E8", 
  borderWidth:1, 
  borderColor:theme.colors.error, 
  borderRadius:theme.borderRadius.md, 
  padding:theme.spacing.md, 
  marginBottom:theme.spacing.md
}, 
errorText:{
  color:theme.colors.error,
  fontSize:14,
  lineHeight:20,
  textAlign:"center"
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
passwordContainer:{
flexDirection:"row",
alignItems:"center", 
backgroundColor:theme.colors.background, 
borderWidth:1,
borderColor:theme.colors.border,
borderRadius:theme.borderRadius.md,
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
primarybutton:{
  backgroundColor:theme.colors.primary, 
  minHeight:52, 
  paddingHorizontal:theme.spacing.md, 
  paddingVertical:theme.spacing.md,
  borderRadius:theme.spacing.md,
  alignItems:'center', 
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
secondaryButtonText:{
  color:theme.colors.textSecondary, 
  fontSize:14, 
}, 
linkText:{
  color:theme.colors.primary,
  fontWeight:"700",
  fontSize:14,
}, 
registerContainer:{
  flexDirection:"row",
  flexWrap:"wrap",
  justifyContent:"center",
  alignItems:"center",

  marginTop:theme.spacing.xl, 
  gap:theme.spacing.xs
}, 
registerText:{
  fontSize:14,
  color:theme.colors.textSecondary
},
inputFocused:{
  borderColor:theme.colors.primary, 
  borderWidth:2
},
eyeButton:{
paddingLeft:theme.spacing.sm,
},
})


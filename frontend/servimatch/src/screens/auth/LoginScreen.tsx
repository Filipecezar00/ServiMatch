import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  Platform
} from "react-native";
import { login } from "../../api/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../types/types";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../stores/useAuthStore";
import {theme} from "../../styles/theme/theme"

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    <KeyboardAvoidingView behavior={Platform.OS==="ios" ? "padding":"height"} style={{flex:1}}>
      <Text style={styles.title}>Bem vindo ao ServiMatch!</Text>
      <Text style={styles.subtitle}>Conecte-se para continuar no ServiMatch</Text>
      <View style={styles.container}>
        {errorMessage ?( 
          <View style={styles.errorBox}>
             <Text style={styles.errorBox}>{errorMessage}</Text>
          </View>
         ):null}
        <TextInput
          placeholder="E-mail"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={theme.colors.textSecondary}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          style={styles.input}
        />

        <Pressable onPress={handleLogin} disabled={loading} style={({pressed})=>[
          styles.primarybutton,
          pressed && {opacity:0.9}
        ]}>
          {loading ? <ActivityIndicator color={theme.colors.surface}/> : <Text style={styles.primarybuttonText}>Entrar</Text>}
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")} style={styles.secondaryButton}>
          <Text style={styles.linkText}>Não tem conta ?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
container:{
  flex:1,
  backgroundColor:theme.colors.background,
  justifyContent:'center',
  padding:theme.spacing.lg,
},
title:{
  fontSize:28,
  color:theme.colors.textPrimary,
  marginBottom:theme.spacing.md, 
  fontWeight:'bold',
}, 
subtitle:{
  fontSize:14,
  color:theme.colors.textSecondary, 
  marginBottom:theme.spacing.xl
}, 
errorBox:{
  backgroundColor:"#FDE8E8", 
  borderWidth:1, 
  borderColor:theme.colors.error, 
  borderRadius:theme.colors.error, 
  padding:theme.spacing.sm, 
  marginBottom:theme.spacing.md
}, 
errorText:{
  color:theme.colors.error,
  fontSize:14,
  textAlign:"center"
}, 
input:{
  backgroundColor:theme.colors.surface, 
  borderWidth:1,
  borderColor:theme.colors.border, 
  borderRadius:theme.borderRadius.md,
  padding:theme.spacing.md,
  marginBottom:theme.spacing.md, 
  color:theme.colors.textPrimary,
  fontSize:16, 
}, 
primarybutton:{
  backgroundColor:theme.colors.primary, 
  padding:theme.spacing.md, 
  borderRadius:theme.spacing.md,
  alignItems:'center', 
  marginTop:theme.spacing.sm
},
primarybuttonText:{
  color:theme.colors.surface, 
  fontWeight:'bold', 
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
  fontWeight:'bold'
}, 
})


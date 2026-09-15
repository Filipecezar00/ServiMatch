import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { login } from "../api/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../stores/useAuthStore";

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
    if (!email) {
      return setErrorMessage("Preencha todos os campos");
    }
    if (!email.trim()) {
      return setErrorMessage("O email é obrigatorio");
    }
    if (!senha || senha.trim().length < 8) {
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
    <KeyboardAvoidingView>
      <View>
        {errorMessage && <Text>{errorMessage}</Text>}
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <Pressable onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text>Entrar</Text>}
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text>Não tem conta ?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

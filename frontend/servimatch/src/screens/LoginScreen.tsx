import { useState } from "react";
import {
  View,
  Text,
  Alert,
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
  const [isEmail, setIsEmail] = useState("");
  const [isSenha, setIsSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const global_session = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!isEmail || isEmail.trim().length < 10) {
      Alert.alert("Preencha todos os campos");
      return setErrorMessage(
        "ERRO: O email precisa ter no mínimo 10 caracteres",
      );
    }
    if (!isSenha || isSenha.trim().length < 8) {
      console.log("Preencha todos os campos");
      return setErrorMessage("A senha precisa ter no mínimo 8 caracteres");
    }
    setIsLoading(true);
    try {
      const req_login = await login(isEmail, isSenha);

      global_session(req_login.usuario, req_login.token);
    } catch (error) {
      Alert.alert("Erro ao realizar login");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = useNavigation<LoginScreenNavigationProp>();
  return (
    <KeyboardAvoidingView>
      <View>
        <TextInput
          placeholder="E-mail"
          value={isEmail}
          onChangeText={setIsEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          value={isSenha}
          onChangeText={setIsSenha}
          secureTextEntry={true}
        />

        <Pressable onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator /> : <Text>Entrar</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

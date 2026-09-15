import React, { use, useState } from "react";
import { View, Text, Button, Alert, Platform } from "react-native";
import { login } from "../api/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../stores/useAuthStore";
import { KeyboardAvoidingView } from "react-native/types_generated/index";
import { ActivityIndicator } from "react-native/types_generated/index";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default async function LoginScreen() {
  const [isEmail, setIsEmail] = useState("");
  const [isSenha, setIsSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const global_session = useAuthStore((state) => state.login);

  const handleLogin = async (email: string, senha: string) => {
    if (!email || email.trim().length < 10) {
      Alert.alert("Preencha todos os campos");
      return setErrorMessage(
        "ERRO: O email precisa ter no mínimo 10 caracteres",
      );
    }
    if (!senha || senha.trim().length < 8) {
      console.log("Preencha todos os campos");
      return setErrorMessage("A senha precisa ter no mínimo 8 caracteres");
    }
    setIsLoading(true);
    try {
      const req_login = await login(email, senha);

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
        <input
          placeholder="E-mail"
          value={isEmail}
          onChange={setIsEmail}
          keyboardType="email-addres"
          autoCapitalize="none"
        />
        <input
          placeholder="Senha"
          value={setIsSenha}
          onChangeTexto={setIsSenha}
          secureTextEntry={true}
        />

        <Button onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator /> : <text>Entrar</text>}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

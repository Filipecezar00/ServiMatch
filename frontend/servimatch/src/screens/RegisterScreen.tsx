import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { register } from "../api/auth";
import { useAuthStore } from "../stores/useAuthStore";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;
export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const global_session = useAuthStore((state) => state.register);
  const handleRegister = async () => {
    setErrorMessage("");

    if (!email || !email.trim()) {
      return setErrorMessage("É necessário adicionar um Email");
    }

    if (!nome || nome.length < 3) {
      return setErrorMessage("O nome deve possuir no mínimo 3 caracteres");
    }

    if (!senha || senha.length < 8) {
      return setErrorMessage("A senha deve possuir no mínimo 8 caracteres");
    }
    setLoading(true);
    try {
      const resposta_api = await register(email, nome, senha);

      global_session(resposta_api.usuario);
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
  const navigation = useNavigation<RegisterScreenNavigationProp>();
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
        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <Pressable onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text>Cadastrar</Text>}
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text>Já Possuo conta</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

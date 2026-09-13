import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/types";
import { useNavigation } from "@react-navigation/native";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;
export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  return (
    <View>
      <Text>Tela de Cadastro</Text>
      <Button
        title="Já possuo uma conta"
        onPress={() => navigation.navigate("Login")}
      ></Button>
    </View>
  );
}

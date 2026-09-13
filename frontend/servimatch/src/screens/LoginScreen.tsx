import React from "react";
import { View, Text, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types/types";
import { useNavigation } from "@react-navigation/native";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export default async function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  return (
    <View>
      <Text>Tela de login</Text>
      <Button
        onPress={() => navigation.navigate("Register")}
        title="Não tenho uma conta"
      />
    </View>
  );
}

import { useState } from "react";
import { AppNavigator } from "../navigation/AppStack";
import { AuthNavigator } from "../navigation/AuthStack";
import { View } from "react-native";

export default function RootNavigator() {
  const [logado, setLogado] = useState(false);
  return <View>{logado ? <AuthNavigator /> : <AppNavigator />}</View>;
}

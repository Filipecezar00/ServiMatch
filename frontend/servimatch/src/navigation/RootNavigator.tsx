import { useState } from "react";
import { AppNavigator } from "../navigation/AppStack";
import { AuthNavigator } from "../navigation/AuthStack";

export default function RootNavigator() {
  const [logado, setLogado] = useState(false);
  return logado ? <AppNavigator /> : <AuthNavigator />;
}

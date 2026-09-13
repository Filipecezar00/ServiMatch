import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "../servimatch/src/navigation/RootNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />;
    </NavigationContainer>
  );
}

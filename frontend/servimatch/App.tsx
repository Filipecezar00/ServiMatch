import { LogBox } from 'react-native';

if(typeof globalThis !=="undefined" && typeof(globalThis as any).self ==="undefined"){
    (globalThis as any).self = globalThis
}


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "../servimatch/src/navigation/RootNavigator";
import "react-native-gesture-handler";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

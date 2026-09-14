import { AppNavigator } from "./AppStack";
import { AuthNavigator } from "./AuthStack";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";

export default function RootNavigator() {
  const [IsHidration, SetIsHidration] = useState(false);
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      SetIsHidration(true);
    } else {
      const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
        SetIsHidration(true);
      });
      return () => unsubscribe();
    }
  }, []);

  if (!IsHidration) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>;
  }

  return token ? <AppNavigator /> : <AuthNavigator />;
}

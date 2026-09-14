import { AppNavigator } from "./AppStack";
import { AuthNavigator } from "./AuthStack";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";

export default function RootNavigator() {
  const [isHydrated, setIsHydrated] = useState(false);
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    } else {
      const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
        setIsHydrated(true);
      });
      return () => unsubscribe();
    }
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return token ? <AppNavigator /> : <AuthNavigator />;
}

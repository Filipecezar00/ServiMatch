import { useColorScheme } from "react-native";
import {lightColors,darkColors,spacing,borderRadius} from "./theme";
import {useThemeStore} from "../../stores/useThemeStore";

export function useAppTheme(){
    const systemColorScheme = useColorScheme(); 
    const themeMode = useThemeStore((state) => state.themeMode);


    const activeScheme = themeMode ===  "system" ? systemColorScheme : themeMode;

    return {
        colors:activeScheme === "dark" ? darkColors : lightColors,
        spacing,
        borderRadius,
        themeMode,
    };
}
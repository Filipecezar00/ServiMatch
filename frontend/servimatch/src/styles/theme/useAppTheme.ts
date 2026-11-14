import { useColorScheme } from "react-native";
import {lightColors,darkColors,spacing,borderRadius} from "./theme";

export function useAppTheme(){
    const colorScheme = useColorScheme(); 

    const colors = colorScheme ===  "dark" ? darkColors : lightColors;

    return {
        colors,
        spacing,
        borderRadius,
    };
}
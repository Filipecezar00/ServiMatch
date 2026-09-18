import { AppStackParamList } from "../types/types";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}

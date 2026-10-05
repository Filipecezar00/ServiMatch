import { useRoute } from "@react-navigation/native";
import { profile_informations } from "../../api/profile";
import { useAuthStore } from "../../stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { View, Text } from "react-native";

export function Profile() {
  const usuarioId = useAuthStore((store) => store.usuario?.id);
  const route = useRoute();
  const { id } = route.params;

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["Profile", usuarioId],
    queryFn: () => profile_informations(id),
    enabled: !!usuarioId,
  });

  return (
    <View>
      <View>{isError && <Text>Erro ao renderizar Perfil</Text>}</View>
       
       <View>
        <Text>Usuário: {profile?.usuario.nome}</Text>
        <Text>Nota: {profile?.usuario.media_rating}</Text>
        <Text>Quantidade de avaliações: {profile?.usuario.total_reviews}</Text>
        <Text>Quantidade de trocas concluídas: {profile?.usuario.}</Text>
       </View>
    </View>
  );
}

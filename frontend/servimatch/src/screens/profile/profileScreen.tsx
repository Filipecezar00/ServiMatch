import { useRoute } from "@react-navigation/native";
import { profile_informations } from "../../api/profile";
import { useAuthStore } from "../../stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export function Profile() {
  const usuarioId = useAuthStore((store) => store.usuario?.id);
  const logout = useAuthStore((store) => store.logout);
  const route = useRoute();

  const params = route.params as { id?: number } | undefined;
  const perfilTargetId = params?.id || usuarioId;
  const ehMeuPerfil = !params?.id || Number(params.id) === Number(usuarioId);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["Profile", perfilTargetId],
    queryFn: () => profile_informations(perfilTargetId),
    enabled: !!perfilTargetId,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View>
        <Text>Erro ao renderizar Perfil</Text>{" "}
        <Pressable onPress={() => refetch()}>
          <Text>Tente Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
        <View>
          <Text>Usuário: {profile?.usuario.nome}</Text>
          <View>
            <View>
              <Text>Nota: {profile.usuario.media_rating}</Text>
              <Text>Avaliações: {profile.usuario.total_reviews}</Text>
              <Text>
                Trocas Concluidas: {profile.usuario.trocas_concluidas}
              </Text>
            </View>

            <View>
              Serviços oferecidos:{" "}
              {profile?.usuario.servicos.map((servico) => {
                return (
                  <View key={servico.id}>
                    <Text>{servico.nome}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <Text>Avaliações desse usuário</Text>
        {profile.reviews.length === 0 ? (
          <Text>Nenhuma avaliação ainda.</Text>
        ) : (
          profile.reviews.map((review) => (
            <View key={review.id}>
              <Text>{review.reviewer_nome}</Text>
              <Text>Nota: {review.rating}</Text>
              <Text>{review.comment}</Text>
            </View>
          ))
        )}

        <View>
          <Text>
            Membro desde:{" "}
            {new Date(profile.usuario.criado_em).toLocaleString("pt-BR")}
          </Text>
        </View>

        {ehMeuPerfil && (
          <View>
            <Pressable>
              <Text>Editar Perfil</Text>
            </Pressable>
            <Pressable onPress={logout}>
              <Text>Sair da Conta</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { profile_informations } from "../../api/profile";
import { useAuthStore } from "../../stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { editar_profile } from "../../api/profile";

export function Profile() {
  const usuarioId = useAuthStore((store) => store.usuario?.id);
  const logout = useAuthStore((store) => store.logout);
  const route = useRoute();

  const params = route.params as { id?: number } | undefined;
  const perfilTargetId = params?.id || usuarioId;
  const ehMeuPerfil = !params?.id || Number(params.id) === Number(usuarioId);
  const queryClient = useQueryClient();

  const [isOpenModal, setOpenModal] = useState(false);

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

  const {
    mutate: mutateSalvar,
    isPending,
    isError: erroSalvar,
  } = useMutation({
    mutationFn: editar_profile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Profile"] });

      setOpenModal(false);

      Alert.alert("Perfil editado com Sucesso!");
    },
    onError: (error) => {
      Alert.alert("Atenção:", error.message);
    },
  });

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const handleEditar = () => {
    if (profile?.usuario) {
      setNome(profile.usuario.nome);
      setEmail(profile.usuario.email || "");
    }
    setOpenModal(true);
  };

  const handleSalvar = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nome || nome.trim().length < 3) {
      return Alert.alert("O nome deve conter no mínimo três caracteres");
    }

    if (!emailRegex.test(email.trim())) {
      return Alert.alert("O email não possui um formato válido");
    }
    mutateSalvar({ nome: nome.trim(), email: email.trim() });
  };

  const handleFecharModal = () => {
    setOpenModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confimar",
      "Deseja realmente deslogar ?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deslogar",
          style: "destructive",
          onPress: () => {
            queryClient.clear();
            logout();
          },
        },
      ],
      { cancelable: true },
    );
  };

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
            <Pressable onPress={handleEditar}>
              <Text>Editar Perfil</Text>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Text>Sair da Conta</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={isOpenModal}
        animationType="slide"
        onRequestClose={handleFecharModal}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Editar Perfil</Text>
          <TextInput
            onChangeText={setNome}
            value={nome}
            placeholder="Digite seu nome"
          />
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="Digite seu email"
          />
          <Pressable onPress={handleFecharModal}>
            <Text>Cancelar</Text>
          </Pressable>
          <Pressable onPress={handleSalvar} disabled={isPending}>
            {isPending ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text>Salvar</Text>
            )}
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

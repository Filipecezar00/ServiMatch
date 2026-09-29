import { View, Text, Pressable, Alert } from "react-native";
import { PropostaEnviada, PropostaRecebida } from "../types/exchangeTypes";
import { alterarStatusProposta } from "../api/exchangeProposals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function PropostaCardEnviada({
  outro_usuario_nome,
  mensagem,
  status,
  servico_oferecido_titulo,
  servico_desejado_titulo,
}: PropostaEnviada) {
  return (
    <View>
      <Text>Proposta Enviada</Text>
      <View>
        <Text>Serviço Oferecido: {servico_oferecido_titulo}</Text>
        <Text>Serviço Desejado: {servico_desejado_titulo}</Text>
        <Text>Destinatario da proposta: {outro_usuario_nome}</Text>
        <Text>Observações:{mensagem}</Text>
        <Text>Status Atual: {status}</Text>
      </View>
    </View>
  );
}

export function PropostaCardRecebida({
  id,
  outro_usuario_nome,
  mensagem,
  status,
  servico_desejado_titulo,
  servico_oferecido_titulo,
  titulo,
  created_at,
}: PropostaRecebida) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["statusProposta"],
    mutationFn: alterarStatusProposta,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PropostasRecebidas"] });
      Alert.alert("Status alterado com sucesso");
    },
    onError: () => {
      Alert.alert("Erro ao alterar Status da Proposta");
    },
  });

  const handleStatus = (
    id: number,
    statusProposta: "accepted" | "rejected",
  ) => {
    if (!id) {
      return;
    }
    if (!statusProposta) {
      return;
    }
    mutate({ id, statusProposta });
  };

  return (
    <View>
      <Text>Proposta Recebida</Text>
      <View>
        <Text>Serviço desejado: {servico_desejado_titulo}</Text>
        <Text>Serviço oferecido: {servico_oferecido_titulo}</Text>
        <Text>Remetente da proposta: {outro_usuario_nome}</Text>
        <Text>Observações:{mensagem}</Text>
        <View>
          <Text>Status Atual: </Text>
          {status === "pending" ? (
            <View>
              <Pressable
                onPress={() => handleStatus(id, "accepted")}
                disabled={isPending}
              >
                <Text>Aceitar</Text>
              </Pressable>
              <Pressable
                onPress={() => handleStatus(id, "rejected")}
                disabled={isPending}
              >
                <Text>Recusar</Text>
              </Pressable>
            </View>
          ) : (
            <Text>{status}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

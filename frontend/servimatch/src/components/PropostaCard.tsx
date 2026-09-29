import { View, Text, Pressable } from "react-native";
import { PropostaEnviada, PropostaRecebida } from "../types/exchangeTypes";

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
  outro_usuario_nome,
  mensagem,
  status,
  servico_desejado_titulo,
  servico_oferecido_titulo,
}: PropostaRecebida) {
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
              <Pressable>
                <Text>Aceitar</Text>
              </Pressable>
              <Pressable>
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

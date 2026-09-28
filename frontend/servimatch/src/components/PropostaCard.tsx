import { View, Text, Pressable } from "react-native";

export function propostaCardEnviada(
  outro_usuario_nome: string,
  created_at: number,
  mensagem: string,
  status: "pending" | "accepted" | "rejected" | "cancelled",
) {
  return (
    <View>
      <Text>Proposta Enviada</Text>
      <View>
        <Text>Destinatario da proposta: {outro_usuario_nome}</Text>
        <Text>Data de Envio: {created_at}</Text>
        <Text>Observações:{mensagem}</Text>
        <Text>Status Atual: {status}</Text>
      </View>
    </View>
  );
}

export function propostaCardRecebida(
  outro_usuario_nome: string,
  created_at: number,
  mensagem: string,
  status: "pending" | "accepted" | "rejected" | "cancelled",
) {
  return (
    <View>
      <Text>Proposta Recebida</Text>
      <View>
        <Text>Destinatario da proposta: {outro_usuario_nome}</Text>
        <Text>Data de Envio: {created_at}</Text>
        <Text>Observações:{mensagem}</Text>
        <View>
          Status Atual:{" "}
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

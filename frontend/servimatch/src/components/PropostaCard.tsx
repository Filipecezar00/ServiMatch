import { View, Text } from "react-native";

export function propostaCard(
  outro_usuario_nome: string,
  created_at: number,
  mensagem: string,
  status: string,
) {
  return (
    <View>
      <Text>Card da Proposta</Text>
      <View>
        <Text>Destinatario da proposta: {outro_usuario_nome}</Text>
        <Text>Data de Envio: {created_at}</Text>
        <Text>Observações:{mensagem}</Text>
        <Text>Status Atual: {status}</Text>
      </View>
    </View>
  );
}

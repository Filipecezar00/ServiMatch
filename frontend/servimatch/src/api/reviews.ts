import { api } from "../config/api";
import { extractErrorMessage } from "./utils";
import { Review } from "../types/reviews";

export async function avaliarTroca(
  exchangeId: number,
  payload: { reviewedId: number; rating: number; comment: string },
): Promise<Review> {
  try {
    const resposta = await api.post(`/reviews/criar/${exchangeId}`, payload);
    return resposta.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

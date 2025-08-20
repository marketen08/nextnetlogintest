import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono";
import { setCookie } from "hono/cookie";

type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;
type RequestType = InferRequestType<typeof client.api.auth.login.$post>;

type LoginInput = {
  email: string;
  password: string;
};


export const useLogin = () => {
    return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      const response = await client.api.auth.login.$post({
        json: { email, password },
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      return data; // acá debería venir tu token o cookie
    },
  });
}

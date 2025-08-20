import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetClientes = () => {
    const query = useQuery({
        queryKey: ["clientes"],
        queryFn: async () => {
            const response = await client.api.clientes.$get({ query: { tipo: "P" } });

            if (!response.ok){
                throw new Error("Failed to fetch clientes");
            }

            const respuesta = await response.json();
            
            return respuesta;
        },
    });

    return query;
}
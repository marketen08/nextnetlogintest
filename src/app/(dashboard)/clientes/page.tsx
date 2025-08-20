"use client";

import { Loader2, Plus } from "lucide-react";
// import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetClientes } from "@/features/clientes/api/use-get-clientes";
import { Skeleton } from "@/components/ui/skeleton";

const ClientesPage = () => {
    // const newCliente = useNewAccount();
    // const deleteClientes = useBulkDeleteClientes();
    const clientesQuery = useGetClientes();
    const clientes = clientesQuery?.data?.data || [];

    console.log(clientes, 'clientes');
    const isDisabled = clientesQuery.isLoading;

    if (clientesQuery.isLoading){
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return ( 
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle>
                        Clientes page
                    </CardTitle>
                    {/* <Button onClick={newCliente.onOpen} size="sm">
                        <Plus className="size-4 mr-2" />
                        Add new
                    </Button> */}
                </CardHeader>
                <CardContent>
                    <DataTable 
                        filterKey="nombre"
                        columns={ columns }
                        data={clientes}
                        onDelete={(row)=> {
                            // const ids = row.map((r) => r.original.id);
                            // deleteClientes.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
     );
}
 
export default ClientesPage;
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetClientesQuery } from '@/store/services/clientes';
import { useState } from 'react';

export default function TestClientes() {
  const [params, setParams] = useState({
    pageIndex: 0,
    pageSize: 10,
    search: '',
    activo: undefined as boolean | undefined,
  });

  const { data, isLoading, error, refetch } = useGetClientesQuery(params);

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Clientes API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Page Index:</label>
              <input
                type="number"
                value={params.pageIndex}
                onChange={(e) => setParams(prev => ({ ...prev, pageIndex: parseInt(e.target.value) || 0 }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Page Size:</label>
              <input
                type="number"
                value={params.pageSize}
                onChange={(e) => setParams(prev => ({ ...prev, pageSize: parseInt(e.target.value) || 10 }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Search:</label>
              <input
                type="text"
                value={params.search}
                onChange={(e) => setParams(prev => ({ ...prev, search: e.target.value }))}
                className="w-full p-2 border rounded"
                placeholder="Buscar..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Activo:</label>
              <select
                value={params.activo === undefined ? 'undefined' : params.activo.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setParams(prev => ({ 
                    ...prev, 
                    activo: value === 'undefined' ? undefined : value === 'true' 
                  }));
                }}
                className="w-full p-2 border rounded"
              >
                <option value="undefined">Todos</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Query Status:</h3>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Error: {error ? JSON.stringify(error, null, 2) : 'None'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Response Data:</h3>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
              {data ? JSON.stringify(data, null, 2) : 'No data'}
            </pre>
          </div>

          <Button onClick={() => refetch()}>
            Refetch Clientes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

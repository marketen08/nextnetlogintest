"use client";

import { useGetUsersPagedQuery } from "@/store/services/auth";
import { Button } from "@/components/ui/button";

export function TestUsersConnection() {
  const { data: usersData, isLoading, error, refetch } = useGetUsersPagedQuery();

  return (
    <div className="mb-4 p-4 border rounded bg-blue-50">
      <h3 className="font-semibold mb-2">🔧 Test Usuarios Sistema</h3>
      <div className="space-y-2">
        <Button onClick={() => refetch()} disabled={isLoading} size="sm">
          {isLoading ? '🔄 Cargando...' : '🚀 Recargar Usuarios'}
        </Button>
        
        <div className="text-sm">
          <strong>Estado:</strong> {
            isLoading ? '🔄 Cargando...' : 
            error ? '❌ Error' : 
            usersData ? `✅ ${usersData.data?.length || 0} usuarios encontrados` : 
            '⏳ No cargado'
          }
        </div>
        
        {usersData?.data && (
          <details className="text-xs">
            <summary>👥 Ver usuarios ({usersData.data.length})</summary>
            <div className="bg-gray-100 p-2 mt-2 max-h-32 overflow-auto">
              {usersData.data.map((user) => (
                <div key={user.id} className="mb-1">
                  <strong>{user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.email}</strong>
                  <span className="ml-2 text-gray-500">({user.email})</span>
                </div>
              ))}
            </div>
          </details>
        )}
        
        {error && (
          <details className="text-xs text-red-600">
            <summary>❌ Ver error</summary>
            <pre className="bg-red-50 p-2 mt-2 overflow-auto max-h-32">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

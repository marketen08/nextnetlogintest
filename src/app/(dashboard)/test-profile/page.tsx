"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetProfileQuery } from '@/store/services/profile';
import { useAuth } from '@/components/auth-guard';
import { useEffect } from 'react';

export default function TestProfile() {
  const { user: authUser } = useAuth();
  const queryResult = useGetProfileQuery(undefined, {
    skip: false, // Asegurar que no se salte
    refetchOnMountOrArgChange: true,
  });
  
  const { data: profileUser, isLoading, error, refetch } = queryResult;

  useEffect(() => {
    console.log('TestProfile - Auth user:', authUser);
    console.log('TestProfile - Query result:', queryResult);
    console.log('TestProfile - Profile data:', profileUser);
    console.log('TestProfile - IsLoading:', isLoading);
    console.log('TestProfile - Error:', error);
  }, [authUser, queryResult, profileUser, isLoading, error]);

  const handleManualFetch = async () => {
    console.log('Manual fetch triggered');
    try {
      const result = await refetch();
      console.log('Manual fetch result:', result);
    } catch (err) {
      console.error('Manual fetch error:', err);
    }
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Profile API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Auth User (from token):</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(authUser, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold">Profile Query Status:</h3>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Error: {error ? JSON.stringify(error, null, 2) : 'None'}</p>
            <p>Has Access Token: {authUser?.accessToken ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Profile Data:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-48">
              {profileUser ? JSON.stringify(profileUser, null, 2) : 'No data'}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleManualFetch}>
              Manual Refetch
            </Button>
            <Button onClick={() => console.log('Current query state:', queryResult)}>
              Log Query State
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

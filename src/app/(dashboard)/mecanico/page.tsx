"use client";

import { withAuth } from '@/components/auth-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MecanicoPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Mecánico</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Esta página solo es accesible para mecánicos.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Proteger con rol específico
export default withAuth(MecanicoPage, { requiredRoles: ['Mecanico'] });

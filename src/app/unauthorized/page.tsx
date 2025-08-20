import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            Acceso Denegado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta página.
          </p>
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full">
                Ir al Dashboard
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

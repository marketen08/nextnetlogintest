"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScrollTestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test de Scroll Independiente</h1>
        <p className="text-muted-foreground">
          Esta página demuestra el scroll independiente entre el sidebar y el contenido principal.
        </p>
      </div>

      {/* Generar mucho contenido para probar el scroll */}
      {Array.from({ length: 20 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Tarjeta de Prueba #{i + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Esta es una tarjeta de prueba para demostrar el scroll independiente. 
                El sidebar debe tener su propio scroll vertical que no afecte el scroll 
                de esta página principal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Característica A</h4>
                  <p className="text-sm text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Característica B</h4>
                  <p className="text-sm text-muted-foreground">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
              <div className="p-4 border-l-4 border-primary bg-primary/10">
                <p className="text-sm">
                  <strong>Nota:</strong> Cuando haces scroll en esta página, el sidebar 
                  permanece fijo y mantiene su propia posición de scroll independiente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Final de la Página</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            ¡Has llegado al final! Nota cómo el sidebar mantuvo su posición independiente 
            durante todo el scroll de esta página.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
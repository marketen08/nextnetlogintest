import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugScrollPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug del Layout de Scroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="font-bold mb-2">Estado del Sidebar</h4>
                <ul className="text-sm space-y-1">
                  <li>• Desktop: position relative (parte del layout)</li>
                  <li>• Mobile: position fixed (overlay)</li>
                  <li>• Scroll interno: overflow-y-auto en navegación</li>
                  <li>• Header/footer fijos dentro del sidebar</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h4 className="font-bold mb-2">Estado del Main Content</h4>
                <ul className="text-sm space-y-1">
                  <li>• Layout principal: h-screen</li>
                  <li>• Contenido: overflow-y-auto</li>
                  <li>• Independiente del sidebar scroll</li>
                  <li>• Flexbox: flex-1 para ocupar espacio restante</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-bold mb-2">Testing del Scroll</h4>
              <p className="text-sm mb-2">
                Para probar que funciona correctamente:
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Haz scroll en esta página - solo el contenido principal debe moverse</li>
                <li>Si hay muchos elementos en el sidebar, solo esa área debe hacer scroll</li>
                <li>Los scrolls deben ser completamente independientes</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido extenso para probar el scroll */}
      {Array.from({ length: 15 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Tarjeta de Contenido #{i + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta es una tarjeta #{i + 1} para crear contenido suficiente que permita 
              hacer scroll en la página principal. El sidebar debe mantener su 
              posición independiente mientras haces scroll aquí.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
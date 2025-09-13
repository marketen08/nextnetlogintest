"use client";

import { useState } from "react";
import { TaskDashboard } from "./components/task-dashboard";
import { TaskList } from "./components/task-list";
import { TaskKanban } from "./components/task-kanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  List, 
  Target,
  Users,
  Calendar,
  TrendingUp,
  Columns3 
} from "lucide-react";

export default function TareasPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Tareas</h1>
            <p className="text-muted-foreground">
              Sistema de seguimiento y gestión de tareas de desarrollo
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Navegación por pestañas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <Columns3 className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="lista" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <TaskDashboard />
          </TabsContent>

          <TabsContent value="kanban" className="mt-6">
            <TaskKanban />
          </TabsContent>

          <TabsContent value="lista" className="mt-6">
            <TaskList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
    <div className="h-screen flex flex-col">
      {/* Header simplificado */}
      <div className="flex flex-col gap-3 pb-4">
        {/* Navegación por pestañas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
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

          <TabsContent value="dashboard" className="flex-1 mt-4">
            <TaskDashboard />
          </TabsContent>

          <TabsContent value="kanban" className="flex-1 mt-4 h-full">
            <TaskKanban />
          </TabsContent>

          <TabsContent value="lista" className="flex-1 mt-4">
            <TaskList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

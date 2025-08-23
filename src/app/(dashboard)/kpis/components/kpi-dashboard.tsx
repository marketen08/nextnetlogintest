"use client";

import { useState, useMemo } from "react";
import { useGetKpiMetricsQuery, useGetKpiSummaryQuery } from "@/store/services/kpis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Area,
  AreaChart
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertTriangle,
  Target,
  Clock,
  Users,
  GitCommit
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiDashboardProps {
  refreshTrigger: number;
}

export function KpiDashboard({ refreshTrigger }: KpiDashboardProps) {
  // Fetch real KPI data from API
  const { data: kpiResponse, isLoading: isLoadingMetrics } = useGetKpiMetricsQuery({});
  const { data: summaryResponse, isLoading: isLoadingSummary } = useGetKpiSummaryQuery({});
  
  // Extract data from API response
  const kpiMetrics = kpiResponse?.data || [];
  const summary = summaryResponse?.data;

  // Process data for charts
  const productivityData = useMemo(() => {
    if (!kpiMetrics.length) {
      // Fallback mock data
      return [
        { fecha: '2024-01', storyPoints: 45, commits: 120, coverage: 85 },
        { fecha: '2024-02', storyPoints: 52, commits: 135, coverage: 87 },
        { fecha: '2024-03', storyPoints: 48, commits: 128, coverage: 89 },
        { fecha: '2024-04', storyPoints: 58, commits: 145, coverage: 91 },
        { fecha: '2024-05', storyPoints: 55, commits: 140, coverage: 88 },
        { fecha: '2024-06', storyPoints: 62, commits: 155, coverage: 92 },
      ];
    }

    // Group by month and calculate averages
    const monthlyData = kpiMetrics.reduce((acc, metric) => {
      const month = metric.fecha.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          fecha: month,
          storyPoints: 0,
          commits: 0,
          coverage: 0,
          count: 0
        };
      }
      acc[month].storyPoints += metric.storyPoints || 0;
      acc[month].commits += metric.commits || 0;
      acc[month].coverage += metric.codeCoverage || 0;
      acc[month].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).map((data: any) => ({
      fecha: data.fecha,
      storyPoints: Math.round(data.storyPoints / data.count),
      commits: Math.round(data.commits / data.count),
      coverage: Math.round(data.coverage / data.count),
    })).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [kpiMetrics, refreshTrigger]);

  const developerData = useMemo(() => {
    if (!kpiMetrics.length) {
      // Fallback mock data
      return [
        { name: 'Juan Pérez', storyPoints: 85, bugs: 3, coverage: 94, satisfaction: 4.5 },
        { name: 'María García', storyPoints: 78, bugs: 1, coverage: 96, satisfaction: 4.8 },
        { name: 'Carlos Rodriguez', storyPoints: 92, bugs: 2, coverage: 88, satisfaction: 4.2 },
        { name: 'Ana López', storyPoints: 71, bugs: 4, coverage: 91, satisfaction: 4.1 },
        { name: 'Pedro Martínez', storyPoints: 88, bugs: 2, coverage: 89, satisfaction: 4.4 },
        { name: 'Laura González', storyPoints: 76, bugs: 1, coverage: 93, satisfaction: 4.6 },
      ];
    }

    // Group by developer and calculate totals/averages
    const devData = kpiMetrics.reduce((acc, metric) => {
      if (!acc[metric.desarrollador]) {
        acc[metric.desarrollador] = {
          name: metric.desarrollador,
          storyPoints: 0,
          bugs: 0,
          coverage: 0,
          satisfaction: 0,
          count: 0
        };
      }
      acc[metric.desarrollador].storyPoints += metric.storyPoints || 0;
      acc[metric.desarrollador].bugs += metric.bugsEncontrados || 0;
      acc[metric.desarrollador].coverage += metric.codeCoverage || 0;
      acc[metric.desarrollador].satisfaction += (
        (metric.satisfaccionCliente || 0) + 
        (metric.satisfaccionEquipo || 0)
      ) / 2;
      acc[metric.desarrollador].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(devData).map((dev: any) => ({
      name: dev.name,
      storyPoints: Math.round(dev.storyPoints),
      bugs: Math.round(dev.bugs / dev.count),
      coverage: Math.round(dev.coverage / dev.count),
      satisfaction: Number((dev.satisfaction / dev.count).toFixed(1)),
    })).sort((a, b) => b.storyPoints - a.storyPoints);
  }, [kpiMetrics, refreshTrigger]);

  // Datos mock para demostración - en producción vendrían de API
  const productivityDataFallback = [
    { fecha: '2024-01', storyPoints: 45, commits: 120, coverage: 85 },
    { fecha: '2024-02', storyPoints: 52, commits: 135, coverage: 87 },
    { fecha: '2024-03', storyPoints: 48, commits: 128, coverage: 89 },
    { fecha: '2024-04', storyPoints: 58, commits: 145, coverage: 91 },
    { fecha: '2024-05', storyPoints: 55, commits: 140, coverage: 88 },
    { fecha: '2024-06', storyPoints: 62, commits: 155, coverage: 92 },
  ];

  const developerDataFallback = [
    { name: 'Juan Pérez', storyPoints: 85, bugs: 3, coverage: 94, satisfaction: 4.5 },
    { name: 'María García', storyPoints: 78, bugs: 1, coverage: 96, satisfaction: 4.8 },
    { name: 'Carlos Rodriguez', storyPoints: 92, bugs: 2, coverage: 88, satisfaction: 4.2 },
    { name: 'Ana López', storyPoints: 71, bugs: 4, coverage: 91, satisfaction: 4.1 },
    { name: 'Pedro Martínez', storyPoints: 88, bugs: 2, coverage: 89, satisfaction: 4.4 },
    { name: 'Laura González', storyPoints: 76, bugs: 1, coverage: 93, satisfaction: 4.6 },
  ];

  const projectData = [
    { name: 'Sistema de Ventas', value: 35, color: '#8884d8' },
    { name: 'Portal Cliente', value: 25, color: '#82ca9d' },
    { name: 'API Gateway', value: 20, color: '#ffc658' },
    { name: 'Dashboard Analytics', value: 12, color: '#ff7300' },
    { name: 'Mobile App', value: 8, color: '#00ff00' },
  ];

  const qualityData = [
    { mes: 'Ene', bugsCreados: 15, bugsResueltos: 18, deployments: 12 },
    { mes: 'Feb', bugsCreados: 12, bugsResueltos: 15, deployments: 14 },
    { mes: 'Mar', bugsCreados: 18, bugsResueltos: 16, deployments: 11 },
    { mes: 'Abr', bugsCreados: 8, bugsResueltos: 20, deployments: 16 },
    { mes: 'May', bugsCreados: 10, bugsResueltos: 12, deployments: 18 },
    { mes: 'Jun', bugsCreados: 6, bugsResueltos: 16, deployments: 20 },
    { mes: 'Jul', bugsCreados: 6, bugsResueltos: 8, deployments: 20 },
    { mes: 'Ago', bugsCreados: 6, bugsResueltos: 8, deployments: 20 },
  ];

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    trendValue, 
    icon: Icon, 
    color = "blue" 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    trend?: "up" | "down";
    trendValue?: string;
    icon: any;
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}{unit}
        </div>
        {trend && trendValue && (
          <p className={cn(
            "text-xs flex items-center mt-1",
            trend === "up" ? "text-green-600" : "text-red-600"
          )}>
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Story Points (Mes)"
          value={kpiMetrics.reduce((total, metric) => total + (metric.storyPoints || 0), 0)}
          icon={Target}
          trend="up"
          trendValue={`${kpiMetrics.length} registros`}
          color="blue"
        />
        <MetricCard
          title="Bugs Resueltos"
          value={kpiMetrics.reduce((total, metric) => total + (metric.bugsResueltos || 0), 0)}
          unit={`/${kpiMetrics.reduce((total, metric) => total + (metric.bugsEncontrados || 0), 0)}`}
          icon={Award}
          trend="up"
          trendValue="Resolución activa"
          color="green"
        />
        <MetricCard
          title="Coverage Promedio"
          value={kpiMetrics.length > 0 
            ? Math.round(kpiMetrics.reduce((total, metric) => total + (metric.codeCoverage || 0), 0) / kpiMetrics.length)
            : 0}
          unit="%"
          icon={Clock}
          trend="up"
          trendValue="Meta: 85%"
          color="purple"
        />
        <MetricCard
          title="Commits Totales"
          value={kpiMetrics.reduce((total, metric) => total + (metric.commits || 0), 0)}
          icon={GitCommit}
          trend="up"
          trendValue={`${developerData.length} desarrolladores`}
          color="orange"
        />
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productividad en el Tiempo */}
        <Card>
          <CardHeader>
            <CardTitle>Productividad Mensual</CardTitle>
            <CardDescription>Story Points y Commits por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="storyPoints" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Story Points"
                />
                <Line 
                  type="monotone" 
                  dataKey="commits" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Commits"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calidad y Deployments */}
        <Card>
          <CardHeader>
            <CardTitle>Calidad y Entregas</CardTitle>
            <CardDescription>Bugs y deployments por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={qualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="bugsResueltos" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  name="Bugs Resueltos"
                />
                <Area 
                  type="monotone" 
                  dataKey="bugsCreados" 
                  stackId="1"
                  stroke="#ff7c7c" 
                  fill="#ff7c7c"
                  name="Bugs Creados"
                />
                <Line 
                  type="monotone" 
                  dataKey="deployments" 
                  stroke="#ffc658" 
                  strokeWidth={3}
                  name="Deployments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Proyecto</CardTitle>
            <CardDescription>Story Points por proyecto</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Code Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Code Coverage Tendencia</CardTitle>
            <CardDescription>Porcentaje de cobertura mensual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={[
                { name: 'Coverage Actual', value: 92, fill: '#8884d8' },
                { name: 'Meta', value: 85, fill: '#82ca9d' }
              ]}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Legend iconSize={18} wrapperStyle={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking de Desarrolladores */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Desarrolladores</CardTitle>
          <CardDescription>Rendimiento individual del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Desarrollador</TableHead>
                  <TableHead>Story Points</TableHead>
                  <TableHead>Bugs</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Satisfacción</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developerData
                  .sort((a, b) => b.storyPoints - a.storyPoints)
                  .map((dev, index) => (
                    <TableRow key={dev.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="w-4 h-4 text-yellow-500" />}
                          {index === 1 && <Award className="w-4 h-4 text-gray-400" />}
                          {index === 2 && <Award className="w-4 h-4 text-amber-600" />}
                          #{index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{dev.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(dev.storyPoints / 100) * 100}%` }}
                            ></div>
                          </div>
                          {dev.storyPoints}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={dev.bugs <= 2 ? "default" : "destructive"}>
                          {dev.bugs}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={dev.coverage >= 90 ? "default" : "secondary"}>
                          {dev.coverage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-3 h-3 rounded-full",
                                i < Math.floor(dev.satisfaction)
                                  ? "bg-yellow-400"
                                  : "bg-gray-200"
                              )}
                            />
                          ))}
                          <span className="ml-1 text-sm">{dev.satisfaction}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            dev.storyPoints > 80 && dev.bugs <= 2 
                              ? "default" 
                              : dev.storyPoints > 70 
                                ? "secondary" 
                                : "destructive"
                          }
                        >
                          {dev.storyPoints > 80 && dev.bugs <= 2 
                            ? "Excelente" 
                            : dev.storyPoints > 70 
                              ? "Bueno" 
                              : "Necesita Mejora"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Métricas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Velocidad del Equipo</span>
              <Badge>62 SP/Sprint</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tiempo de Review</span>
              <Badge variant="secondary">2.3h promedio</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <Badge>94%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">MTTR</span>
              <Badge variant="secondary">4.2h</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas y Avisos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Coverage bajo en Mobile App</p>
                <p className="text-muted-foreground">Actual: 76% (Meta: 85%)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Aumento de bugs en Portal</p>
                <p className="text-muted-foreground">+3 bugs esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objetivos del Mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Story Points</span>
                <span>85/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full w-[85%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Coverage Promedio</span>
                <span>92/95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-[97%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deployments</span>
                <span>18/20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full w-[90%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

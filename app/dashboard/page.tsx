import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, Package, TrendingUp, Bot, Activity } from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      title: "Mensajes Hoy",
      value: "1,234",
      change: "+12%",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      title: "Clientes Activos",
      value: "856",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Productos",
      value: "342",
      change: "+3%",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Conversiones",
      value: "23.5%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control de ChatBot Manager
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Estado del ChatBot
            </CardTitle>
            <CardDescription>
              Rendimiento y métricas en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Estado</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Activo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Respuestas/min</span>
                <span className="text-sm font-medium">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo de respuesta</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Precisión</span>
                <span className="text-sm font-medium">94.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas interacciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Nuevo cliente registrado</p>
                  <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Producto actualizado</p>
                  <p className="text-xs text-muted-foreground">Hace 12 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">ChatBot entrenado</p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

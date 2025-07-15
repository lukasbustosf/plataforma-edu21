'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsGrid } from '@/components/ui/StatsGrid'
import { ResponsiveTable } from '@/components/ui/ResponsiveTable'
import { useQuery } from 'react-query'
import { api } from '@/lib/api'
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  CogIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CpuChipIcon,
  CloudIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import P1ComplianceStatus from '@/components/dashboard/P1ComplianceStatus'
import { P2ComplianceStatus } from '@/components/dashboard/P2ComplianceStatus'

export default function AdminDashboard() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Fetch admin analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    'admin-analytics',
    () => api.getSchoolDashboard(),
    {
      enabled: !!user?.user_id
    }
  )

  // Mock data for demonstration
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalSchools: 15,
    activeSchools: 13,
    totalClasses: 156,
    totalQuizzes: 1834,
    monthlyActiveUsers: 756,
    aiCreditsUsed: 4580,
    aiCreditsTotal: 10000,
    systemUptime: 99.8,
    averageResponseTime: 245
  }

  // Convert system stats to StatsGrid format
  const adminStats = [
    {
      id: 'users',
      label: 'Usuarios Totales',
      value: systemStats.totalUsers.toLocaleString(),
      icon: <UsersIcon className="h-5 w-5" />,
      color: 'blue' as const,
      change: { value: 12, type: 'increase' as const, period: 'este mes' }
    },
    {
      id: 'schools',
      label: 'Colegios Activos',
      value: `${systemStats.activeSchools}/${systemStats.totalSchools}`,
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      color: 'green' as const,
      change: { value: 0, type: 'neutral' as const, period: 'sin cambios' }
    },
    {
      id: 'ai-credits',
      label: 'Créditos IA',
      value: `${((systemStats.aiCreditsUsed / systemStats.aiCreditsTotal) * 100).toFixed(0)}%`,
      icon: <CpuChipIcon className="h-5 w-5" />,
      color: 'purple' as const,
      change: { value: 5, type: 'increase' as const, period: 'esta semana' }
    },
    {
      id: 'uptime',
      label: 'Uptime Sistema',
      value: `${systemStats.systemUptime}%`,
      icon: <ShieldCheckIcon className="h-5 w-5" />,
      color: 'green' as const,
      change: { value: 0.2, type: 'increase' as const, period: 'último mes' }
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'user_registered',
      description: 'Nuevo profesor registrado en Colegio San Antonio',
      timestamp: '2 minutos',
      severity: 'info',
      icon: '👤'
    },
    {
      id: 2,
      type: 'system_alert',
      description: 'Uso de créditos AI alcanzó 80% en Escuela Los Andes',
      timestamp: '15 minutos',
      severity: 'warning',
      icon: '⚠️'
    },
    {
      id: 3,
      type: 'game_session',
      description: 'Sesión de juego masiva: 150 estudiantes conectados',
      timestamp: '1 hora',
      severity: 'success',
      icon: '🎮'
    },
    {
      id: 4,
      type: 'performance',
      description: 'Tiempo de respuesta promedio mejoró 15%',
      timestamp: '2 horas',
      severity: 'success',
      icon: '📈'
    }
  ]

  const schoolsOverview = [
    {
      id: 1,
      name: 'Colegio San Antonio',
      students: 450,
      teachers: 28,
      aiUsage: 85,
      status: 'active',
      lastActivity: '5 min'
    },
    {
      id: 2,
      name: 'Escuela Los Andes',
      students: 320,
      teachers: 22,
      aiUsage: 92,
      status: 'warning',
      lastActivity: '1 hora'
    },
    {
      id: 3,
      name: 'Instituto Metropolitano',
      students: 680,
      teachers: 45,
      aiUsage: 67,
      status: 'active',
      lastActivity: '2 min'
    }
  ]

  // Table columns for schools overview
  const schoolsColumns = [
    {
      key: 'name',
      label: 'Colegio',
      mobileLabel: 'Nombre',
      render: (value: string, row: any) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'students',
      label: 'Estudiantes',
      hiddenOnMobile: true,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'teachers',
      label: 'Profesores',
      hiddenOnMobile: true,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'aiUsage',
      label: 'Uso IA',
      render: (value: number) => (
        <div className="flex items-center">
          <div className="w-8 sm:w-12 bg-gray-200 rounded-full h-2 mr-2">
            <div 
              className={`h-2 rounded-full ${
                value > 90 ? 'bg-red-500' : value > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-mobile-xs">{value}%</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 rounded-full text-mobile-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Activo' : value === 'warning' ? 'Atención' : 'Inactivo'}
        </span>
      )
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <DashboardLayout>
      <div className="section-spacing">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-mobile text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="page-title text-white">Panel de Administración EDU21 🛡️</h1>
              <p className="page-subtitle text-white/90 mt-2">
                Bienvenido, {fullName}. Monitorea y gestiona toda la plataforma desde aquí.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-emerald-300">
              <CloudIcon className="h-5 w-5" />
              <span className="text-mobile-sm font-medium">Sistema Operativo</span>
            </div>
          </div>
        </div>

        {/* P1 & P2 Compliance Status - Mobile Responsive */}
        <div className="grid-responsive-1 lg:grid-cols-2 gap-mobile">
          <div className="card-responsive p-mobile">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title">🚀 Estado P1</h2>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-mobile-xs text-green-700 font-medium">COMPLETO</span>
              </div>
            </div>
            <P1ComplianceStatus />
          </div>
          
          <div className="card-responsive p-mobile">
            <P2ComplianceStatus />
          </div>
        </div>

        {/* Key Metrics - Responsive Stats Grid */}
        <StatsGrid stats={adminStats} className="animate-fade-in" />

        {/* Two Column Layout for larger screens */}
        <div className="grid-responsive-1 lg:grid-cols-2 gap-mobile">
          {/* Schools Overview */}
          <div className="card-responsive">
            <div className="p-mobile border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="page-title">🏫 Colegios</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="btn-responsive"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Ver Todos
                </Button>
              </div>
            </div>
            <ResponsiveTable
              columns={schoolsColumns}
              data={schoolsOverview}
              keyExtractor={(row) => row.id.toString()}
              className="border-0 shadow-none"
            />
          </div>

          {/* Recent Activity */}
          <div className="card-responsive p-mobile">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="page-title">📊 Actividad Reciente</h2>
              <Button 
                variant="outline" 
                size="sm"
                className="btn-responsive"
              >
                Ver Historial
              </Button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="text-xl sm:text-lg flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-mobile-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-mobile-xs text-gray-500">{activity.timestamp}</span>
                      <span className={`inline-flex px-2 py-1 rounded-full text-mobile-xs font-medium ${getSeverityColor(activity.severity)}`}>
                        {activity.severity === 'success' ? 'Éxito' : 
                         activity.severity === 'warning' ? 'Atención' : 
                         activity.severity === 'error' ? 'Error' : 'Info'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Performance - Full Width */}
        <div className="card-responsive p-mobile">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="page-title">⚡ Rendimiento del Sistema</h2>
            <div className="flex space-x-2">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input-field-mobile text-mobile-sm"
              >
                <option value="hour">Última Hora</option>
                <option value="day">Último Día</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mes</option>
              </select>
            </div>
          </div>
          
          <div className="grid-responsive-2 lg:grid-cols-4 gap-mobile">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-mobile-xs text-blue-600 font-medium mb-1">Usuarios Activos</div>
              <div className="text-mobile-xl font-bold text-blue-800">{systemStats.monthlyActiveUsers}</div>
              <div className="text-mobile-xs text-blue-600 mt-1">Este mes</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-mobile-xs text-green-600 font-medium mb-1">Tiempo Respuesta</div>
              <div className="text-mobile-xl font-bold text-green-800">{systemStats.averageResponseTime}ms</div>
              <div className="text-mobile-xs text-green-600 mt-1">Promedio</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-mobile-xs text-purple-600 font-medium mb-1">Clases Total</div>
              <div className="text-mobile-xl font-bold text-purple-800">{systemStats.totalClasses}</div>
              <div className="text-mobile-xs text-purple-600 mt-1">Activas</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="text-mobile-xs text-yellow-600 font-medium mb-1">Quizzes</div>
              <div className="text-mobile-xl font-bold text-yellow-800">{systemStats.totalQuizzes.toLocaleString()}</div>
              <div className="text-mobile-xs text-yellow-600 mt-1">Creados</div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile First */}
        <div className="card-responsive p-mobile">
          <h2 className="page-title mb-4">🚀 Acciones Rápidas</h2>
          <div className="grid-responsive-2 lg:grid-cols-4 gap-mobile">
            <Button 
              className="btn-responsive h-auto p-4 flex-col space-y-2"
              variant="outline"
            >
              <UsersIcon className="h-6 w-6" />
              <span className="text-mobile-sm">Gestionar Usuarios</span>
            </Button>
            
            <Button 
              className="btn-responsive h-auto p-4 flex-col space-y-2"
              variant="outline"
            >
              <BuildingOfficeIcon className="h-6 w-6" />
              <span className="text-mobile-sm">Ver Colegios</span>
            </Button>
            
            <Button 
              className="btn-responsive h-auto p-4 flex-col space-y-2"
              variant="outline"
            >
              <ChartBarIcon className="h-6 w-6" />
              <span className="text-mobile-sm">Reportes</span>
            </Button>
            
            <Button 
              className="btn-responsive h-auto p-4 flex-col space-y-2"
              variant="outline"
            >
              <CogIcon className="h-6 w-6" />
              <span className="text-mobile-sm">Configuración</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { supabase } from '@/lib/supabase' // Import Supabase client
import { 
  BeakerIcon, 
  PlusIcon, 
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CogIcon,
  ChartPieIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CubeIcon,
  AcademicCapIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsGrid } from '@/components/ui/StatsGrid'
import { ResponsiveTable } from '@/components/ui/ResponsiveTable'
import { formatDate } from '@/lib/utils'

export default function AdminLabManagementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')
  const [materialUsage, setMaterialUsage] = useState([])
  const [loadingMaterials, setLoadingMaterials] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoadingMaterials(true)
      try {
        const response = await fetch('/api/lab/materials');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch materials');
        }
        
        // The API data should be in a good format, but we can adapt if needed
        const formattedData = result.data.map((item: any) => ({
          id: item.id,
          material_name: item.name, // The API returns 'name', we map it to 'material_name'
          category: item.category || 'Sin categoría',
          total_stock: item.stock_quantity || 0,
          used_sessions: 0, // Placeholder, needs calculation
          usage_rate: 0, // Placeholder, needs calculation
          schools_using: 0, // Placeholder, needs calculation
          status: 'optimal' // Placeholder, needs logic
        }));

        setMaterialUsage(formattedData);
      } catch (error) {
        console.error('Error fetching materials:', error)
        // Keep mock data on error for now so the page doesn't break
      } finally {
        setLoadingMaterials(false)
      }
    }

    if (activeTab === 'materials') {
      fetchMaterials()
    }
  }, [activeTab])

  // Mock data for development
  const systemStats = [
    {
      id: 'total-activities',
      label: 'Total Actividades',
      value: 120,
      change: { value: 15, type: 'increase' as const, period: 'este mes' },
      icon: <BeakerIcon className="h-5 w-5" />,
      color: 'blue' as const
    },
    {
      id: 'active-schools',
      label: 'Colegios Activos',
      value: 45,
      change: { value: 8, type: 'increase' as const, period: 'este trimestre' },
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
      color: 'green' as const
    },
    {
      id: 'total-sessions',
      label: 'Sesiones Realizadas',
      value: 2340,
      change: { value: 12, type: 'increase' as const, period: 'vs mes anterior' },
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'purple' as const
    },
    {
      id: 'material-usage',
      label: 'Uso de Materiales',
      value: 89,
      change: { value: 5, type: 'increase' as const, period: '% utilización' },
      icon: <CubeIcon className="h-5 w-5" />,
      color: 'yellow' as const
    }
  ]

  // School activity data
  const schoolActivity = [
    {
      id: '1',
      school_name: 'Colegio San Patricio',
      rbd: '12345',
      sessions_count: 45,
      evidence_count: 180,
      teachers_active: 8,
      last_activity: '2024-01-20',
      status: 'active',
      coverage_percentage: 85
    },
    {
      id: '2',
      school_name: 'Liceo República de Chile',
      rbd: '67890',
      sessions_count: 32,
      evidence_count: 120,
      teachers_active: 6,
      last_activity: '2024-01-18',
      status: 'active',
      coverage_percentage: 72
    },
    {
      id: '3',
      school_name: 'Escuela Básica Los Aromos',
      rbd: '11111',
      sessions_count: 8,
      evidence_count: 25,
      teachers_active: 2,
      last_activity: '2024-01-10',
      status: 'low_activity',
      coverage_percentage: 35
    }
  ]

  // Performance alerts
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Baja adopción en colegios rurales',
      description: '3 colegios no han registrado actividad en 2 semanas',
      action_needed: 'Contactar coordinadores',
      priority: 'medium'
    },
    {
      id: '2',
      type: 'success',
      title: 'Meta de cobertura OA alcanzada',
      description: 'Se ha cubierto el 85% de OAs del currículum PK-2',
      action_needed: 'Expandir a grados superiores',
      priority: 'low'
    },
    {
      id: '3',
      type: 'error',
      title: 'Escasez de material concreto',
      description: 'Stock bajo en bloques geométricos para Q2',
      action_needed: 'Gestionar reposición urgente',
      priority: 'high'
    }
  ]

  const schoolColumns = [
    {
      key: 'school',
      label: 'Colegio',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.school_name}</div>
          <div className="text-sm text-gray-500">RBD: {item.rbd}</div>
        </div>
      )
    },
    {
      key: 'activity',
      label: 'Actividad',
      render: (item: any) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{item.sessions_count} sesiones</div>
          <div className="text-xs text-gray-500">{item.teachers_active} profesores</div>
        </div>
      )
    },
    {
      key: 'evidence',
      label: 'Evidencias',
      render: (item: any) => (
        <div className="flex items-center justify-center">
          <PhotoIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm font-medium">{item.evidence_count}</span>
        </div>
      )
    },
    {
      key: 'coverage',
      label: 'Cobertura OA',
      render: (item: any) => (
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>{item.coverage_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                item.coverage_percentage >= 80 ? 'bg-green-500' :
                item.coverage_percentage >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${item.coverage_percentage}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (item: any) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'active' ? 'bg-green-100 text-green-800' :
          item.status === 'low_activity' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status === 'active' ? 'Activo' :
           item.status === 'low_activity' ? 'Baja Actividad' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: any) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/admin/lab-management/schools/${item.id}`)}
          >
            <DocumentTextIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/admin/lab-management/schools/${item.id}/analytics`)}
          >
            <ChartBarIcon className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const materialColumns = [
    {
      key: 'material',
      label: 'Material',
      render: (item: any) => (
        <div>
          <div className="font-medium text-gray-900">{item.material_name}</div>
          <div className="text-sm text-gray-500">{item.category}</div>
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (item: any) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{item.total_stock}</div>
          <div className="text-xs text-gray-500">unidades</div>
        </div>
      )
    },
    {
      key: 'usage',
      label: 'Uso',
      render: (item: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{item.used_sessions} sesiones</div>
          <div className="text-xs text-gray-500">{item.schools_using} colegios</div>
        </div>
      )
    },
    {
      key: 'rate',
      label: 'Tasa Uso',
      render: (item: any) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900">{item.usage_rate}%</div>
          <div className={`text-xs ${
            item.usage_rate >= 70 ? 'text-green-600' :
            item.usage_rate >= 40 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {item.status === 'high_demand' ? 'Alta demanda' :
             item.status === 'optimal' ? 'Óptimo' : 'Bajo uso'}
          </div>
        </div>
      )
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Laboratorios Móviles</h1>
            <p className="text-gray-600">Panel de administración y monitoreo del sistema de laboratorios</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/lab-management/materials')}
            >
              <CubeIcon className="h-5 w-5 mr-2" />
              Gestionar Materiales
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/admin/lab-management/analytics')}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/lab-management/activities/new')}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Actividad
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Resumen', icon: ChartPieIcon },
              { id: 'schools', label: 'Colegios', icon: BuildingOfficeIcon },
              { id: 'materials', label: 'Materiales', icon: CubeIcon },
              { id: 'alerts', label: 'Alertas', icon: ExclamationTriangleIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <StatsGrid stats={systemStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento Mensual</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Gráfico de rendimiento</p>
                    <p className="text-xs text-gray-400">Datos de sesiones y cobertura OA</p>
                  </div>
                </div>
              </div>

              {/* Top Schools */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Colegios Más Activos</h3>
                <div className="space-y-4">
                  {schoolActivity.slice(0, 3).map((school, index) => (
                    <div key={school.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{school.school_name}</div>
                          <div className="text-xs text-gray-500">{school.sessions_count} sesiones</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{school.coverage_percentage}%</div>
                        <div className="text-xs text-gray-400">cobertura</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Schools Tab */}
        {activeTab === 'schools' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Actividad por Colegio</h3>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/admin/lab-management/schools/export')}
                >
                  Exportar Reporte
                </Button>
              </div>
            </div>
            <ResponsiveTable
              data={schoolActivity}
              columns={schoolColumns}
              loading={false}
              emptyMessage="No hay datos de colegios disponibles"
            />
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Uso de Materiales</h3>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/admin/lab-management/materials/inventory')}
                >
                  Gestionar Inventario
                </Button>
              </div>
            </div>
            <ResponsiveTable
              data={materialUsage}
              columns={materialColumns}
              loading={loadingMaterials}
              emptyMessage="No hay datos de materiales disponibles"
            />
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'bg-red-50 border-red-400' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {alert.type === 'error' ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    ) : alert.type === 'warning' ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${
                      alert.type === 'error' ? 'text-red-800' :
                      alert.type === 'warning' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>
                      {alert.title}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      alert.type === 'error' ? 'text-red-700' :
                      alert.type === 'warning' ? 'text-yellow-700' :
                      'text-green-700'
                    }`}>
                      <p>{alert.description}</p>
                    </div>
                    <div className="mt-3">
                      <div className="flex space-x-2">
                        <Button
                          variant={alert.type === 'error' ? 'primary' : 'secondary'}
                          size="sm"
                        >
                          {alert.action_needed}
                        </Button>
                        <Button variant="secondary" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
 
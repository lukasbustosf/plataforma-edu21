'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { PlusIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/ResponsiveTable'

export default function AdminLabActivitiesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      console.log('[DEBUG] Iniciando fetch de actividades...');
      try {
        const response = await fetch('/api/lab/activities')
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        const result = await response.json()
        
        // --- LOG DE DEPURACIÓN ---
        console.log('[DEBUG] Datos recibidos de la API:', JSON.stringify(result, null, 2));

        if (result.success && Array.isArray(result.data)) {
          setActivities(result.data)
          // --- LOG DE DEPURACIÓN ---
          console.log('[DEBUG] Estado "activities" actualizado:', JSON.stringify(result.data, null, 2));
        } else {
          console.error('[DEBUG] La respuesta de la API no fue exitosa o los datos no son un array:', result);
          throw new Error(result.message || 'An error occurred')
        }
      } catch (error) {
        console.error('Error fetching lab activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const columns = [
    {
      key: 'title',
      label: 'Título',
      render: (_value: any, item: any) => {
        // --- LOG DE DEPURACIÓN ---
        console.log('[DEBUG] Renderizando celda "Título". Item:', item);
        return (
          <div>
            <div className="font-medium text-gray-900">{item?.title || 'Sin Título'}</div>
            <div className="text-sm text-gray-500">{item?.slug || ''}</div>
          </div>
        )
      },
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value: any, item: any) => {
        // --- LOG DE DEPURACIÓN ---
        console.log('[DEBUG] Renderizando celda "Estado". Item:', item);
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item?.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {item?.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        )
      },
    },
    {
      key: 'created_at',
      label: 'Fecha de Creación',
      render: (_value: any, item: any) => {
        // --- LOG DE DEPURACIÓN ---
        console.log('[DEBUG] Renderizando celda "Fecha". Item:', item);
        return (
          <div className="text-sm text-gray-500">
            {item?.created_at ? new Date(item.created_at).toLocaleDateString() : 'Fecha inválida'}
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: any, item: any) => {
        // --- LOG DE DEPURACIÓN ---
        console.log('[DEBUG] Renderizando celda "Acciones". Item:', item);
        return (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => item?.id && router.push(`/admin/lab/activities/edit/${item.id}`)}
              disabled={!item?.id}
            >
              Editar
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!item?.id}
              // onClick={() => handleDelete(item.id)}
            >
              Eliminar
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-3" />
              Catálogo de Actividades del Laboratorio
            </h1>
            <p className="text-gray-600">
              Gestiona todas las actividades disponibles en el módulo de laboratorios.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/admin/lab/activities/new')}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Nueva Actividad
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ResponsiveTable
            data={activities}
            columns={columns}
            loading={loading}
            emptyMessage="No se encontraron actividades."
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

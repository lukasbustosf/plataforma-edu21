'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { ArrowLeftIcon, PlayCircleIcon, DocumentTextIcon, VideoCameraIcon, CubeIcon, ClockIcon, UserGroupIcon, ChartBarIcon, CheckCircleIcon, ListBulletIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ActivityDetailView from '@/components/lab/ActivityDetailView';

// Tipos de datos completos
interface Material { name: string }
interface Course { course_id: string; course_name: string }
interface ActivityLog {
  id: string;
  execution_date: string;
  student_count: number;
  success_rating: number;
  notes: string;
  courses: Course | null;
  evidence?: any[];
}
interface Activity {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  steps_markdown: string;
  learning_objectives: string[];
  indicators_markdown: string;
  assessment_markdown: string;
  resource_urls: string[];
  video_url: string;
  duration_minutes: number;
  group_size: number;
  difficulty_level: number;
  target_cycle: string;
  subject: string;
  grade_level: string;
  lab_material: Material | null;
  my_recent_executions: ActivityLog[];
  lab_activity_metrics: {
    total_executions: number;
    avg_rating: number | null;
    avg_duration_minutes: number | null;
    unique_teachers: number;
  } | null;
}

// Componente para tarjetas de información
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}
const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <div className="flex items-center p-3 bg-gray-100 rounded-lg">
    <div className="flex-shrink-0 text-gray-500">{icon}</div>
    <div className="ml-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

import { LogExecutionModal } from '@/components/ui/LogExecutionModal';

export default function ActivityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetch(`/api/lab/activities/${slug}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) setActivity(result.data);
          else throw new Error(result.message);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleLogSuccess = async () => {
    setIsLogModalOpen(false);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lab/activities/${slug}`);
      const result = await res.json();
      if (result.success) setActivity(result.data);
      else throw new Error(result.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center items-center h-64"><LoadingSpinner /></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="text-red-500 p-4 bg-red-50 rounded-md">Error: {error}</div></DashboardLayout>;
  if (!activity) return <DashboardLayout><div>Actividad no encontrada.</div></DashboardLayout>;

  // Tarjetas de métricas agregadas
  const metrics = activity.lab_activity_metrics;
  const metricsCards = metrics ? (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-md font-semibold mb-2 text-gray-800 flex items-center"><ChartBarIcon className="h-5 w-5 mr-2" />Métricas de Ejecución</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={<ChartBarIcon className="h-6 w-6" />} label="Veces ejecutada" value={metrics.total_executions || 0} />
        <InfoCard icon={<CheckCircleIcon className="h-6 w-6" />} label="Rating promedio" value={metrics.avg_rating?.toFixed(1) || '-'} />
        <InfoCard icon={<ClockIcon className="h-6 w-6" />} label="Duración promedio (min)" value={metrics.avg_duration_minutes?.toFixed(1) || '-'} />
        <InfoCard icon={<UserGroupIcon className="h-6 w-6" />} label="Docentes únicos" value={metrics.unique_teachers || 1} />
      </div>
    </div>
  ) : null;

  // Historial de ejecuciones recientes
  const recentExecutions = activity.my_recent_executions || [];
  const executionsTable = (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h3 className="text-md font-semibold mb-2 text-gray-800 flex items-center"><ListBulletIcon className="h-5 w-5 mr-2" />Mis Ejecuciones Recientes</h3>
      {recentExecutions.length === 0 ? (
        <p className="text-gray-500">Aún no has registrado ejecuciones para esta actividad.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Alumnos</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valoración</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Curso</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Evidencia</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.map((log) => (
                <tr key={log.id} className="bg-white even:bg-gray-50">
                  <td className="px-4 py-2">{new Date(log.execution_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{log.student_count}</td>
                  <td className="px-4 py-2">{log.success_rating}</td>
                  <td className="px-4 py-2">{log.notes || '-'}</td>
                  <td className="px-4 py-2">{log.courses?.course_name || '-'}</td>
                  <td className="px-4 py-2">
                    {log.evidence && log.evidence.length > 0 ? (
                      log.evidence.map((ev: any) => (
                        <span key={ev.id} className="inline-block mr-2">
                          {ev.file_type === 'image' ? (
                            <a href={ev.file_url} target="_blank" rel="noopener noreferrer">
                              <img src={ev.file_url} alt={ev.file_name} className="w-10 h-10 object-cover rounded border inline-block" />
                            </a>
                          ) : ev.file_type === 'pdf' ? (
                            <a href={ev.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PDF</a>
                          ) : (
                            <a href={ev.file_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 underline">Archivo</a>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Button variant="secondary" onClick={() => router.back()} className="mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver al Catálogo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Información Clave */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
              <p className="text-gray-600 mt-2">{activity.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Detalles</h2>
              <InfoCard icon={<ClockIcon className="h-6 w-6"/>} label="Duración" value={`${activity.duration_minutes} min`} />
              <InfoCard icon={<UserGroupIcon className="h-6 w-6"/>} label="Tamaño Grupo" value={`${activity.group_size} personas`} />
              <InfoCard icon={<ChartBarIcon className="h-6 w-6"/>} label="Dificultad" value={`Nivel ${activity.difficulty_level} / 5`} />
              <InfoCard icon={<CubeIcon className="h-6 w-6"/>} label="Material Principal" value={activity.lab_material?.name || 'No especificado'} />
            </div>

            {/* NUEVAS FUNCIONALIDADES: Métricas y Ejecuciones */}
            {metricsCards}
            {executionsTable}

            <div className="text-center">
              <Button size="lg" onClick={() => setIsLogModalOpen(true)}>
                <PlayCircleIcon className="h-6 w-6 mr-2" />
                Registrar Ejecución
              </Button>
            </div>
          </div>

          {/* Columna Derecha - Contenido Principal */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 prose max-w-none">
            <img src={activity.cover_image_url || ''} alt={activity.title} className="w-full rounded-lg mb-6" />
            
            <h2 className="flex items-center"><ListBulletIcon className="h-6 w-6 mr-2 text-blue-600"/>Pasos de la Actividad</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.steps_markdown}</ReactMarkdown>

            <h2 className="flex items-center"><CheckCircleIcon className="h-6 w-6 mr-2 text-green-600"/>Objetivos de Aprendizaje</h2>
            <ul>{activity.learning_objectives?.map((oa, i) => <li key={i}>{oa}</li>)}</ul>

            <h2 className="flex items-center"><PencilSquareIcon className="h-6 w-6 mr-2 text-yellow-600"/>Indicadores y Evaluación</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.indicators_markdown}</ReactMarkdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{activity.assessment_markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
      <LogExecutionModal
        open={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        activityId={activity.id}
        onSuccess={handleLogSuccess}
      />
    </DashboardLayout>
  );
}

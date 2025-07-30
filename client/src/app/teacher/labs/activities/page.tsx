'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookOpenIcon, PlusIcon, MagnifyingGlassIcon, FunnelIcon, ExclamationTriangleIcon, ArrowPathIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/store/auth';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

const subjects = ['Ciencias Naturales', 'Matemáticas', 'Lenguaje', 'Historia', 'Artes'];
const gradeLevels = ['Pre-Kínder', 'Kínder', '1º Básico', '2º Básico', '3º Básico', '4º Básico'];

// Card component to display a single activity
interface ActivityCardProps {
  activity: any;
  onEdit: (id: string) => void;
  onDelete: (activity: any) => void;
  currentUserId: string;
}

const ActivityCard = ({ activity, onEdit, onDelete, currentUserId }: ActivityCardProps) => {
  const isCreator = activity.creator_id === currentUserId;

  // Función para truncar texto largo
  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Función para extraer solo la instrucción general si está en markdown
  const getShortDescription = (description: string) => {
    if (!description) return 'Sin descripción disponible.';
    
    // Si contiene markdown, extraer solo el texto de la instrucción general
    if (description.includes('## Instrucción General')) {
      const generalSection = description.split('## Instrucción Específica')[0];
      const cleanText = generalSection.replace('## Instrucción General', '').trim();
      return truncateText(cleanText, 100);
    }
    
    return truncateText(description, 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-gray-100">
      <Link href={`/teacher/labs/activity/${activity.slug}`} className="flex flex-col h-full group">
        {/* Imagen mejorada - más vertical */}
        <div className="relative h-56 w-full overflow-hidden">
          <img 
            src={activity.cover_image_url || 'https://via.placeholder.com/400x280.png?text=Actividad'} 
            alt={activity.title || 'Actividad'} 
            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105" 
          />
          {/* Badge de nivel */}
          {activity.target_cycle && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {activity.target_cycle}
              </span>
            </div>
          )}
          {/* Badge de duración */}
          {activity.duration_minutes && (
            <div className="absolute top-3 right-3">
              <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                {activity.duration_minutes} min
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          {/* Título */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {activity.title || 'Actividad sin título'}
          </h3>
          
          {/* Descripción truncada */}
          <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3 leading-relaxed">
            {getShortDescription(activity.description)}
          </p>
          
          {/* Tags/OAs */}
          <div className="flex flex-wrap gap-1 mb-3">
            {activity.oa_ids?.slice(0, 2).map((oa: any, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {oa}
              </span>
            ))}
            {activity.oa_ids?.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                +{activity.oa_ids.length - 2} más
              </span>
            )}
          </div>
          
          {/* Metadatos */}
          <div className="border-t border-gray-200 pt-3 mt-auto">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                {activity.subject || 'Pre-Kínder'}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                {activity.group_size ? `${activity.group_size} estudiantes` : 'Grupo completo'}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Botones de acción */}
      {isCreator && (
        <div className="p-2 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(activity.id)}>
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(activity)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// Main page component
export default function LabActivitiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchMaterials = useCallback(async () => {
    try {
      const response = await fetch('/api/lab/materials');
      if (response.ok) {
        const result = await response.json();
        setMaterials(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append('searchTerm', debouncedSearchTerm);
      if (subjectFilter !== 'all') params.append('subject', subjectFilter);
      if (gradeFilter !== 'all') params.append('grade_level', gradeFilter);
      if (materialFilter !== 'all') params.append('lab_material_id', materialFilter);

      const response = await fetch(`/api/lab/activities?${params.toString()}`);
      if (!response.ok) throw new Error('No se pudieron cargar las actividades.');
      const result = await response.json();
      setActivities(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, subjectFilter, gradeFilter, materialFilter]);

  useEffect(() => {
    fetchMaterials();
    fetchActivities();
  }, [fetchMaterials, fetchActivities]);

  const openDeleteModal = (activity: any) => {
    setActivityToDelete(activity);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setActivityToDelete(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!activityToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/lab/activities/${activityToDelete.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Error al eliminar');
      await fetchActivities();
      closeDeleteModal();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (activityId: string) => {
    alert(`Funcionalidad de editar (ID: ${activityId}) no implementada para profesores todavía.`);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpenIcon className="h-8 w-8 mr-3 text-blue-600" />
              Catálogo de Actividades del Laboratorio
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Explora, filtra y busca actividades didácticas para enriquecer tus clases.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/teacher/labs/activities/create')}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Crear Actividad
          </Button>
        </header>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                    <label htmlFor="search" className="sr-only">Buscar</label>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            id="search"
                            placeholder="Buscar por título, descripción, OA..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="subject" className="sr-only">Asignatura</label>
                    <select
                        id="subject"
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="input w-full"
                    >
                        <option value="all">Todas las asignaturas</option>
                        {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="grade" className="sr-only">Nivel</label>
                    <select
                        id="grade"
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="input w-full"
                    >
                        <option value="all">Todos los niveles</option>
                        {gradeLevels.map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="material" className="sr-only">Material</label>
                    <select
                        id="material"
                        value={materialFilter}
                        onChange={(e) => setMaterialFilter(e.target.value)}
                        className="input w-full"
                    >
                        <option value="all">Todos los materiales</option>
                        {materials.map((material: any) => (
                            <option key={material.id} value={material.id}>{material.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div>
          {isLoading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ArrowPathIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Cargando actividades...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg shadow">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activities.map((activity: any) => (
                    <ActivityCard 
                      key={activity.id} 
                      activity={activity} 
                      onEdit={handleEdit}
                      onDelete={openDeleteModal}
                      currentUserId={user?.user_id || ''}
                    />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <FunnelIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron actividades</h3>
                <p className="text-gray-600">
                    Intenta ajustar los filtros de búsqueda o crea una nueva actividad.
                </p>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Eliminar Actividad"
        message={`¿Estás seguro de que quieres eliminar la actividad "${activityToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        loading={isDeleting}
      />
    </DashboardLayout>
  );
}
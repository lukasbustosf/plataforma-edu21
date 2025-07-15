'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { api } from '@/lib/api'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  PlayIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  UsersIcon,
  ClockIcon,
  SparklesIcon,
  EyeIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsGrid } from '@/components/ui/StatsGrid'
import { formatDate, getGameFormatDisplayName } from '@/lib/utils'
import type { Quiz, Class, GameSession } from '@/types'

export default function TeacherDashboardPage() {
  const router = useRouter()
  const { user, canCreateQuiz, isAuthenticated, isLoading } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Debug auth state
  useEffect(() => {
    console.log('=== TEACHER DASHBOARD LOAD ===')
    console.log('Auth state:', { isAuthenticated, isLoading, userRole: user?.role, userEmail: user?.email })
    console.log('User object:', user)
    console.log('Can create quiz:', canCreateQuiz)
  }, [isAuthenticated, isLoading, user, canCreateQuiz])

  // Fetch teacher's classes
  const { data: classesData, isLoading: classesLoading } = useQuery(
    'teacher-classes',
    () => api.getClasses(),
    {
      enabled: !!user?.user_id
    }
  )

  // Fetch teacher's quizzes
  const { data: quizzesData, isLoading: quizzesLoading } = useQuery(
    'teacher-quizzes',
    () => api.getQuizzes({ limit: 6 }),
    {
      enabled: !!user?.user_id
    }
  )

  const classes = classesData?.classes || []
  const quizzes = quizzesData?.quizzes || []

  // Calculate stats
  const totalStudents = classes.reduce((acc, cls) => acc + (cls.students?.length || 0), 0)
  const activeQuizzes = quizzes.filter(quiz => quiz.mode === 'manual').length
  const aiQuizzes = quizzes.filter(quiz => quiz.mode === 'ai').length

  // Convert stats to StatsGrid format
  const teacherStats = [
    {
      id: 'classes',
      label: 'Mis Clases',
      value: classes.length,
      icon: <AcademicCapIcon className="h-5 w-5" />,
      color: 'blue' as const,
      change: { value: 2, type: 'increase' as const, period: 'este trimestre' }
    },
    {
      id: 'students',
      label: 'Total Estudiantes',
      value: totalStudents,
      icon: <UsersIcon className="h-5 w-5" />,
      color: 'green' as const,
      change: { value: 15, type: 'increase' as const, period: 'este mes' }
    },
    {
      id: 'quizzes',
      label: 'Quizzes Creados',
      value: quizzes.length,
      icon: <DocumentTextIcon className="h-5 w-5" />,
      color: 'purple' as const,
      change: { value: 8, type: 'increase' as const, period: 'esta semana' }
    },
    {
      id: 'games',
      label: 'Juegos Activos',
      value: 3,
      icon: <PlayIcon className="h-5 w-5" />,
      color: 'yellow' as const
    }
  ]

  const quickActions = [
    {
      icon: <PlusIcon className="h-5 w-5" />,
      label: 'Crear Quiz Manual',
      description: 'Crear nuevo cuestionario paso a paso',
      onClick: () => router.push('/teacher/quiz/create'),
      color: 'blue' as const
    },
    {
      icon: <SparklesIcon className="h-5 w-5" />,
      label: 'Generar con IA',
      description: 'Crear quiz automáticamente con inteligencia artificial',
      onClick: () => router.push('/teacher/quiz/create?mode=ai'),
      color: 'purple' as const
    },
    {
      icon: <PlayIcon className="h-5 w-5" />,
      label: 'Evaluación Gamificada',
      description: 'Crear evaluación interactiva con juegos y skins',
      onClick: () => router.push('/teacher/evaluation-gamified/create'),
      color: 'green' as const
    },
    {
      icon: <BookOpenIcon className="h-5 w-5" />,
      label: 'Planificar Clase',
      description: 'Crear nueva planificación de clase',
      onClick: () => router.push('/teacher/lesson/create'),
      color: 'yellow' as const
    }
  ]

  const recentQuizzes = quizzes.slice(0, 3).map(quiz => ({
    id: quiz.quiz_id,
    title: quiz.title,
    subject: 'General', // Quiz doesn't have subject field in type definition
    questions: quiz.questions?.length || 0,
    createdAt: quiz.created_at,
    mode: quiz.mode,
    plays: Math.floor(Math.random() * 50) + 1 // Mock data
  }))

  const myClasses = classes.slice(0, 3).map(cls => ({
    id: cls.class_id,
    name: cls.class_name,
    subject: cls.subjects?.subject_name || 'Sin asignar',
    studentCount: cls.students?.length || 0,
    schedule: 'Por definir', // Class has schedule_json, not schedule
    nextClass: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
  }))

  const handleStartGame = async (quizId: string) => {
    try {
      const gameSession = await api.createGameSession({
        quiz_id: quizId,
        format: 'trivia_lightning',
        settings: {
          max_players: 30,
          time_limit: 30,
          show_correct_answers: true,
          accessibility_mode: true,
          tts_enabled: true
        }
      })
      
      toast.success('Juego creado exitosamente')
      router.push(`/teacher/game/${gameSession.session_id}/lobby`)
    } catch (error) {
      toast.error('Error al crear el juego')
    }
  }

  return (
    <DashboardLayout>
      <div className="section-spacing">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-mobile text-white mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="page-title text-white">
                ¡Hola, {user?.first_name}! 👋
              </h1>
              <p className="page-subtitle text-white/90 mt-2">
                Aquí tienes un resumen de tus clases y actividades
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => router.push('/teacher/quiz/create')}
                className="btn-responsive bg-white text-emerald-600 hover:bg-gray-100"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear Quiz
              </Button>
              <Button
                onClick={() => router.push('/teacher/evaluation-gamified/create')}
                className="btn-responsive bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-semibold"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                🎮 Gamificada
              </Button>
              <Button
                onClick={() => router.push('/teacher/game/create')}
                className="btn-responsive bg-emerald-500 hover:bg-emerald-400 text-white border-0"
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Iniciar Juego
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <StatsGrid stats={teacherStats} className="animate-fade-in" />

        {/* Quick Actions - Mobile First Grid */}
        <div className="card-responsive p-mobile">
          <h2 className="page-title mb-4">🚀 Acciones Rápidas</h2>
          <div className="grid-responsive-2 gap-mobile">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group hover:shadow-md touch-manipulation"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg text-white group-hover:scale-110 transition-transform ${
                    action.color === 'blue' ? 'bg-blue-500' :
                    action.color === 'purple' ? 'bg-purple-500' :
                    action.color === 'green' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-mobile-sm font-semibold text-gray-900">{action.label}</h3>
                    <p className="text-mobile-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Two Column Layout for larger screens */}
        <div className="grid-responsive-1 lg:grid-cols-3 gap-mobile">
          {/* Left Column - Classes & Quizzes */}
          <div className="lg:col-span-2 space-y-mobile">
            {/* My Classes */}
            <div className="card-responsive p-mobile">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="page-title">📚 Mis Clases</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/teacher/classes')}
                  className="btn-responsive"
                >
                  Ver todas
                </Button>
              </div>
              
              {classesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : myClasses.length > 0 ? (
                <div className="space-y-3">
                  {myClasses.map((cls) => (
                    <div key={cls.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-mobile-sm font-semibold text-gray-900 truncate">{cls.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1">
                            <span className="text-mobile-xs text-gray-600">{cls.subject}</span>
                            <span className="text-mobile-xs text-gray-600 flex items-center">
                              <UsersIcon className="h-3 w-3 mr-1" />
                              {cls.studentCount} estudiantes
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-mobile-xs text-gray-500">
                            Próxima: {cls.nextClass.toLocaleDateString('es-CL')}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                            className="btn-responsive"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-mobile-sm font-medium text-gray-900 mb-2">No tienes clases aún</h3>
                  <p className="text-mobile-xs text-gray-500 mb-4">Crea tu primera clase para comenzar</p>
                  <Button
                    onClick={() => router.push('/teacher/classes/create')}
                    className="btn-responsive"
                  >
                    Crear Clase
                  </Button>
                </div>
              )}
            </div>

            {/* Recent Quizzes */}
            <div className="card-responsive p-mobile">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="page-title">📝 Quizzes Recientes</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/teacher/quiz')}
                  className="btn-responsive"
                >
                  Ver todos
                </Button>
              </div>
              
              {quizzesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-mobile-sm font-semibold text-gray-900 truncate">{quiz.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1">
                            <span className="text-mobile-xs text-gray-600">{quiz.subject}</span>
                            <span className="text-mobile-xs text-gray-600">{quiz.questions} preguntas</span>
                            <span className={`text-mobile-xs px-2 py-1 rounded-full ${
                              quiz.mode === 'ai' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {quiz.mode === 'ai' ? 'IA' : 'Manual'}
                            </span>
                          </div>
                          <p className="text-mobile-xs text-gray-500 mt-1">
                            {quiz.plays} reproducciones • {formatDate(quiz.createdAt)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/teacher/quiz/${quiz.id}`)}
                            className="btn-responsive"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStartGame(quiz.id)}
                            className="btn-responsive"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-mobile-sm font-medium text-gray-900 mb-2">No tienes quizzes aún</h3>
                  <p className="text-mobile-xs text-gray-500 mb-4">Crea tu primer quiz para comenzar</p>
                  <Button
                    onClick={() => router.push('/teacher/quiz/create')}
                    className="btn-responsive"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Crear Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Activity & Stats */}
          <div className="space-y-mobile">
            {/* Recent Activity */}
            <div className="card-responsive p-mobile">
              <h2 className="page-title mb-4">📊 Actividad Reciente</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PlayIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-mobile-sm text-gray-900">Juego de Matemáticas iniciado</p>
                    <p className="text-mobile-xs text-gray-500">25 estudiantes participaron • Hace 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PlusIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-mobile-sm text-gray-900">Quiz de Historia creado</p>
                    <p className="text-mobile-xs text-gray-500">15 preguntas • Hace 4 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-mobile-sm text-gray-900">Quiz generado con IA</p>
                    <p className="text-mobile-xs text-gray-500">Ciencias Naturales • Hace 6 horas</p>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/teacher/activity')}
                className="btn-responsive w-full mt-4"
              >
                Ver toda la actividad
              </Button>
            </div>

            {/* Performance Summary */}
            <div className="card-responsive p-mobile">
              <h2 className="page-title mb-4">⚡ Resumen de Rendimiento</h2>
              <div className="space-y-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-mobile-xs text-blue-600 font-medium mb-1">Promedio de Participación</div>
                  <div className="text-mobile-lg font-bold text-blue-800">87%</div>
                  <div className="text-mobile-xs text-blue-600 mt-1">Esta semana</div>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-mobile-xs text-green-600 font-medium mb-1">Juegos Completados</div>
                  <div className="text-mobile-lg font-bold text-green-800">24</div>
                  <div className="text-mobile-xs text-green-600 mt-1">Este mes</div>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-mobile-xs text-purple-600 font-medium mb-1">Satisfacción</div>
                  <div className="text-mobile-lg font-bold text-purple-800">4.8/5</div>
                  <div className="text-mobile-xs text-purple-600 mt-1">Promedio</div>
                </div>
              </div>
            </div>

            {/* Time Selector */}
            <div className="card-responsive p-mobile">
              <h3 className="text-mobile-sm font-semibold text-gray-900 mb-3">Período de Análisis</h3>
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input-field-mobile"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Año</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
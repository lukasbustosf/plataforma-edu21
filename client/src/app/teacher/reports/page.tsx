'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  CalendarIcon, 
  UsersIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

export default function TeacherReportsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')

  const periods = [
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mes' },
    { value: 'quarter', label: 'Este Trimestre' },
    { value: 'year', label: 'Este Año' }
  ]

  const reportTypes = [
    { id: 'overview', name: 'Resumen General', icon: ChartBarIcon },
    { id: 'performance', name: 'Rendimiento Académico', icon: AcademicCapIcon },
    { id: 'engagement', name: 'Participación', icon: UsersIcon },
    { id: 'bloom', name: 'Taxonomía de Bloom', icon: TrophyIcon },
    { id: 'attendance', name: 'Asistencia', icon: ClockIcon }
  ]

  // Mock data for different report types
  const reportData = {
    overview: {
      stats: [
        { label: 'Total Estudiantes', value: 125, change: +8, trend: 'up' },
        { label: 'Promedio General', value: '6.4', change: +0.2, trend: 'up' },
        { label: 'Participación', value: '87%', change: -3, trend: 'down' },
        { label: 'Quizzes Realizados', value: 45, change: +12, trend: 'up' }
      ],
      topPerformers: [
        { name: 'María González', class: '8° A', score: 7.2 },
        { name: 'Carlos Ruiz', class: '7° B', score: 7.0 },
        { name: 'Ana López', class: '8° A', score: 6.9 }
      ],
      needsAttention: [
        { name: 'Pedro Martínez', class: '7° B', score: 4.8, issue: 'Bajo rendimiento' },
        { name: 'Sofía Herrera', class: '8° A', score: 5.2, issue: 'Faltas frecuentes' }
      ]
    },
    performance: {
      bySubject: [
        { subject: 'Matemáticas', average: 6.8, students: 45, trend: 'up' },
        { subject: 'Ciencias', average: 6.5, students: 40, trend: 'stable' },
        { subject: 'Historia', average: 6.2, students: 35, trend: 'down' },
        { subject: 'Lenguaje', average: 6.9, students: 50, trend: 'up' }
      ],
      byGrade: [
        { grade: '6° Básico', average: 6.7, improvement: +0.3 },
        { grade: '7° Básico', average: 6.4, improvement: +0.1 },
        { grade: '8° Básico', average: 6.1, improvement: -0.2 },
        { grade: '1° Medio', average: 6.5, improvement: +0.4 }
      ]
    },
    bloom: {
      levels: [
        { level: 'Recordar', percentage: 85, questions: 120 },
        { level: 'Comprender', percentage: 78, questions: 95 },
        { level: 'Aplicar', percentage: 72, questions: 80 },
        { level: 'Analizar', percentage: 65, questions: 60 },
        { level: 'Evaluar', percentage: 58, questions: 40 },
        { level: 'Crear', percentage: 52, questions: 25 }
      ]
    }
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportData.overview.stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {stat.change > 0 ? '+' : ''}{stat.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mejores Rendimientos</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.overview.topPerformers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-green-700">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.class}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{student.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Requieren Atención</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.overview.needsAttention.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.class} • {student.issue}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-yellow-600">{student.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPerformanceReport = () => (
    <div className="space-y-6">
      {/* Performance by Subject */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Rendimiento por Asignatura</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {reportData.performance.bySubject.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{subject.subject}</span>
                    <span className="text-lg font-bold text-gray-900">{subject.average}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{subject.students} estudiantes</span>
                    <span className={`flex items-center ${
                      subject.trend === 'up' ? 'text-green-600' :
                      subject.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {subject.trend === 'up' && <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />}
                      {subject.trend === 'down' && <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />}
                      {subject.trend === 'up' ? 'Mejorando' : subject.trend === 'down' ? 'Descendiendo' : 'Estable'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        subject.average >= 6.5 ? 'bg-green-500' :
                        subject.average >= 6.0 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(subject.average / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance by Grade */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Rendimiento por Curso</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.performance.byGrade.map((grade, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{grade.grade}</span>
                  <span className="text-xl font-bold text-gray-900">{grade.average}</span>
                </div>
                <div className={`text-sm flex items-center ${
                  grade.improvement > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {grade.improvement > 0 ? (
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {grade.improvement > 0 ? '+' : ''}{grade.improvement} vs período anterior
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderBloomReport = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Análisis Taxonomía de Bloom</h3>
        <p className="text-sm text-gray-600 mt-1">
          Rendimiento de estudiantes por niveles cognitivos
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {reportData.bloom.levels.map((level, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900">{level.level}</span>
                  <span className="text-sm text-gray-600 ml-2">({level.questions} preguntas)</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{level.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    level.percentage >= 80 ? 'bg-green-500' :
                    level.percentage >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${level.percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {level.percentage >= 80 ? 'Excelente dominio' :
                 level.percentage >= 60 ? 'Buen dominio' :
                 'Necesita refuerzo'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCurrentReport = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport()
      case 'performance':
        return renderPerformanceReport()
      case 'bloom':
        return renderBloomReport()
      default:
        return renderOverviewReport()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
            <p className="text-gray-600">Insights detallados sobre el rendimiento académico</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <Button
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              variant="outline"
            >
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tipo de Reporte</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReport(type.id)}
                    className={`p-4 rounded-lg border-2 transition-colors text-center ${
                      selectedReport === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{type.name}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Report Content */}
        {renderCurrentReport()}
      </div>
    </DashboardLayout>
  )
} 
'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { 
  DocumentArrowDownIcon,
  ChartBarIcon,
  PrinterIcon,
  CalendarIcon,
  FunnelIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface OAReport {
  oa_code: string
  oa_description: string
  subject: string
  grade: string
  coverage_percentage: number
  student_count: number
  avg_score: number
  bloom_level: string
  status: 'completed' | 'in_progress' | 'not_started'
  last_evaluated: string
}

interface BloomAnalysis {
  level: string
  percentage: number
  student_count: number
  avg_score: number
  questions_count: number
}

export default function SchoolReportsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('semester')
  const [selectedGrade, setSelectedGrade] = useState('ALL')
  const [selectedSubject, setSelectedSubject] = useState('ALL')
  const [selectedReport, setSelectedReport] = useState('oa_coverage')
  const [dateRange, setDateRange] = useState({
    start: '2024-08-01',
    end: '2024-12-20'
  })

  // Mock data for OA coverage
  const mockOAReports: OAReport[] = [
    {
      oa_code: 'MAT-8B-OA01',
      oa_description: 'Resolver problemas de proporcionalidad directa e inversa',
      subject: 'Matemáticas',
      grade: '8° Básico',
      coverage_percentage: 85,
      student_count: 32,
      avg_score: 78.5,
      bloom_level: 'Aplicar',
      status: 'completed',
      last_evaluated: '2024-06-15'
    },
    {
      oa_code: 'LEN-7B-OA03',
      oa_description: 'Analizar narraciones considerando el narrador y contexto',
      subject: 'Lenguaje',
      grade: '7° Básico',
      coverage_percentage: 92,
      student_count: 28,
      avg_score: 82.1,
      bloom_level: 'Analizar',
      status: 'completed',
      last_evaluated: '2024-06-18'
    },
    {
      oa_code: 'CN-6B-OA05',
      oa_description: 'Explicar los efectos de la actividad humana en el medio ambiente',
      subject: 'Ciencias Naturales',
      grade: '6° Básico',
      coverage_percentage: 67,
      student_count: 30,
      avg_score: 74.3,
      bloom_level: 'Comprender',
      status: 'in_progress',
      last_evaluated: '2024-06-10'
    },
    {
      oa_code: 'HIS-1M-OA02',
      oa_description: 'Analizar procesos de independencia en América',
      subject: 'Historia',
      grade: '1° Medio',
      coverage_percentage: 45,
      student_count: 35,
      avg_score: 71.8,
      bloom_level: 'Evaluar',
      status: 'in_progress',
      last_evaluated: '2024-06-05'
    },
    {
      oa_code: 'FIS-2M-OA04',
      oa_description: 'Comprender conceptos de mecánica y movimiento',
      subject: 'Física',
      grade: '2° Medio',
      coverage_percentage: 0,
      student_count: 26,
      avg_score: 0,
      bloom_level: 'Recordar',
      status: 'not_started',
      last_evaluated: 'N/A'
    }
  ]

  // Mock data for Bloom analysis
  const mockBloomAnalysis: BloomAnalysis[] = [
    { level: 'Recordar', percentage: 15, student_count: 680, avg_score: 78.2, questions_count: 245 },
    { level: 'Comprender', percentage: 25, student_count: 680, avg_score: 75.8, questions_count: 410 },
    { level: 'Aplicar', percentage: 30, student_count: 680, avg_score: 73.5, questions_count: 492 },
    { level: 'Analizar', percentage: 20, student_count: 680, avg_score: 71.2, questions_count: 328 },
    { level: 'Evaluar', percentage: 7, student_count: 680, avg_score: 68.9, questions_count: 115 },
    { level: 'Crear', percentage: 3, student_count: 680, avg_score: 65.4, questions_count: 49 }
  ]

  const grades = ['ALL', '5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio']
  const subjects = ['ALL', 'Matemáticas', 'Lenguaje', 'Ciencias Naturales', 'Historia', 'Física', 'Química', 'Biología', 'Inglés']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'not_started': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      case 'in_progress': return <ClockIcon className="h-4 w-4" />
      case 'not_started': return <ExclamationTriangleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredOAReports = mockOAReports.filter(report => {
    const matchesGrade = selectedGrade === 'ALL' || report.grade === selectedGrade
    const matchesSubject = selectedSubject === 'ALL' || report.subject === selectedSubject
    return matchesGrade && matchesSubject
  })

  const handleExportReport = (format: 'pdf' | 'csv' | 'excel') => {
    toast.success(`Exportando reporte en formato ${format.toUpperCase()}...`)
    // In real app: trigger file download with proper filename
  }

  const handlePrintReport = () => {
    toast.success('Enviando a impresora...')
    // In real app: trigger print dialog
  }

  const handleGenerateCustomReport = () => {
    toast.success('Generando reporte personalizado...')
    // In real app: show custom report builder modal
  }

  const handleViewOADetail = (oaCode: string) => {
    toast.success(`Abriendo detalles de OA: ${oaCode}`)
    // In real app: navigate to OA detail view
  }

  const handleMarkOAAsCompleted = (oaCode: string) => {
    const oa = filteredOAReports.find(r => r.oa_code === oaCode)
    if (oa) {
      oa.status = 'completed'
      oa.coverage_percentage = 100
      toast.success(`OA ${oaCode} marcado como completado`)
    }
  }

  // Calculate statistics
  const totalOAs = filteredOAReports.length
  const completedOAs = filteredOAReports.filter(r => r.status === 'completed').length
  const avgCoverage = filteredOAReports.reduce((sum, r) => sum + r.coverage_percentage, 0) / totalOAs || 0
  const avgScore = filteredOAReports.filter(r => r.avg_score > 0).reduce((sum, r) => sum + r.avg_score, 0) / filteredOAReports.filter(r => r.avg_score > 0).length || 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reportes Académicos 📊</h1>
                <p className="text-gray-600 mt-1">
                  Análisis curricular con cobertura OA y distribución Bloom
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleExportReport('pdf')}
                  variant="outline"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar PDF
                </Button>
                <Button
                  onClick={handlePrintReport}
                  variant="outline"
                >
                  <PrinterIcon className="h-5 w-5 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalOAs}</div>
              <div className="text-sm text-gray-600">OAs Evaluados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedOAs}</div>
              <div className="text-sm text-gray-600">OAs Completados</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getCoverageColor(avgCoverage)}`}>
                {avgCoverage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Cobertura Promedio</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
                {avgScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Nota Promedio</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de reporte
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="oa_coverage">Cobertura OA</option>
                <option value="bloom_analysis">Análisis Bloom</option>
                <option value="performance_trends">Tendencias de Rendimiento</option>
                <option value="attendance_correlation">Correlación Asistencia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="semester">Semestre Actual</option>
                <option value="month">Último Mes</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Año Completo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grado
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'ALL' ? 'Todos los grados' : grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materia
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'ALL' ? 'Todas las materias' : subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha inicio
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha fin
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-3">
              <Button
                onClick={() => handleExportReport('csv')}
                variant="outline"
                size="sm"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button
                onClick={() => handleExportReport('excel')}
                variant="outline"
                size="sm"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
            <Button
              onClick={handleGenerateCustomReport}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Main Report Content */}
        {selectedReport === 'oa_coverage' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Cobertura de Objetivos de Aprendizaje (OA)</h2>
              <p className="text-sm text-gray-600 mt-1">
                Estado de cobertura curricular por OA según MINEDUC
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código OA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Materia/Grado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobertura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rendimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nivel Bloom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOAReports.map((report) => (
                    <tr key={report.oa_code} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.oa_code}</div>
                        <div className="text-xs text-gray-500">
                          {report.student_count} estudiantes
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {report.oa_description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.subject}</div>
                        <div className="text-sm text-gray-500">{report.grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className={`text-sm font-medium ${getCoverageColor(report.coverage_percentage)}`}>
                              {report.coverage_percentage}%
                            </div>
                            <div className="mt-1 bg-gray-200 rounded-full h-2 w-20">
                              <div 
                                className={`h-2 rounded-full ${report.coverage_percentage >= 80 ? 'bg-green-500' : report.coverage_percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${report.coverage_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getScoreColor(report.avg_score)}`}>
                          {report.avg_score > 0 ? report.avg_score.toFixed(1) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.bloom_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">
                            {report.status === 'completed' && 'Completado'}
                            {report.status === 'in_progress' && 'En progreso'}
                            {report.status === 'not_started' && 'No iniciado'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toast.success(`Viendo detalle de ${report.oa_code}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Ver detalle"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOAReports.length === 0 && (
              <div className="text-center py-12">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron datos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Intenta ajustar los filtros para ver los reportes.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedReport === 'bloom_analysis' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Análisis de Taxonomía de Bloom</h2>
              <p className="text-sm text-gray-600 mt-1">
                Distribución de preguntas y rendimiento por nivel cognitivo
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBloomAnalysis.map((analysis, index) => (
                  <div key={analysis.level} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          index < 2 ? 'bg-green-100 text-green-600' :
                          index < 4 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                        }`}>
                          <TrophyIcon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{analysis.level}</h3>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">{analysis.percentage}%</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Promedio de notas:</span>
                        <span className={`font-semibold ${getScoreColor(analysis.avg_score)}`}>
                          {analysis.avg_score.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Preguntas evaluadas:</span>
                        <span className="font-semibold text-gray-900">{analysis.questions_count}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${analysis.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Recomendaciones Pedagógicas</h4>
                    <ul className="mt-2 text-sm text-amber-700 space-y-1">
                      <li>• Aumentar preguntas de nivel "Evaluar" y "Crear" para desarrollar pensamiento crítico</li>
                      <li>• Reforzar niveles básicos si el rendimiento en "Recordar" es bajo</li>
                      <li>• Equilibrar la distribución para alinear con objetivos curriculares</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones de Reporte</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleExportReport('pdf')}
              variant="outline"
              className="w-full"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Descargar PDF Completo
            </Button>
            
            <Button
              onClick={() => toast.success('Programando reporte automático...')}
              variant="outline"
              className="w-full"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Programar Reporte
            </Button>
            
            <Button
              onClick={() => toast.success('Compartiendo con profesores...')}
              variant="outline"
              className="w-full"
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Compartir con Profesores
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Reporte generado: {new Date().toLocaleDateString('es-CL')} a las {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>
              Período: {dateRange.start} al {dateRange.end}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
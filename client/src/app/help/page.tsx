'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { 
  QuestionMarkCircleIcon, 
  BookOpenIcon, 
  VideoCameraIcon, 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const { user, fullName } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('faq')

  // FAQ data based on user role
  const faqs = [
    {
      id: 1,
      question: '¿Cómo puedo crear un quiz con IA?',
      answer: 'Ve a "Crear Quiz", selecciona "Modo IA", ingresa el tema y nivel deseado. La IA generará preguntas automáticamente basadas en el currículum chileno.',
      category: 'quizzes',
      roles: ['TEACHER']
    },
    {
      id: 2,
      question: '¿Cómo me uno a un juego educativo?',
      answer: 'Ve a "Juegos", ingresa el código de sala que te proporcionó tu profesor, y haz clic en "Unirse". Espera en el lobby hasta que comience el juego.',
      category: 'games',
      roles: ['STUDENT']
    },
    {
      id: 3,
      question: '¿Puedo ver el progreso de mis estudiantes en tiempo real?',
      answer: 'Sí, en tu dashboard puedes ver estadísticas en vivo, resultados de juegos recientes y alertas de rendimiento académico.',
      category: 'analytics',
      roles: ['TEACHER', 'ADMIN_ESCOLAR']
    },
    {
      id: 4,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a Configuración > Perfil, haz clic en "Cambiar Contraseña" e ingresa tu contraseña actual y la nueva.',
      category: 'account',
      roles: ['ALL']
    },
    {
      id: 5,
      question: '¿Qué formatos de juego están disponibles?',
      answer: 'Ofrecemos Trivia Lightning, Board Race, Color Match, Memory Flip, Word Storm y más. Cada formato está diseñado para diferentes tipos de aprendizaje.',
      category: 'games',
      roles: ['TEACHER', 'STUDENT']
    },
    {
      id: 6,
      question: '¿Cómo funciona el sistema de logros?',
      answer: 'Los estudiantes ganan logros por participar en juegos, mantener buenas calificaciones, y completar desafíos. Los logros aparecen en su perfil y dashboard.',
      category: 'achievements',
      roles: ['STUDENT', 'TEACHER']
    },
    {
      id: 7,
      question: '¿Puedo exportar reportes de mi clase?',
      answer: 'Sí, ve a "Reportes", selecciona el período y tipo de reporte que necesitas, y haz clic en "Exportar a Excel" o "Exportar a PDF".',
      category: 'reports',
      roles: ['TEACHER', 'ADMIN_ESCOLAR']
    },
    {
      id: 8,
      question: '¿EDU21 es accesible para estudiantes con discapacidades?',
      answer: 'Sí, incluimos TTS (texto a voz), navegación por teclado, alto contraste, soporte para lectores de pantalla y más funciones de accesibilidad.',
      category: 'accessibility',
      roles: ['ALL']
    }
  ]

  const tutorials = [
    {
      id: 1,
      title: 'Introducción a EDU21',
      description: 'Conoce las funciones principales de la plataforma',
      duration: '5 min',
      category: 'getting-started',
      roles: ['ALL']
    },
    {
      id: 2,
      title: 'Crear tu primer quiz con IA',
      description: 'Aprende a generar contenido educativo automáticamente',
      duration: '8 min',
      category: 'quizzes',
      roles: ['TEACHER']
    },
    {
      id: 3,
      title: 'Configurar un juego educativo',
      description: 'Convierte tus quizzes en experiencias interactivas',
      duration: '10 min',
      category: 'games',
      roles: ['TEACHER']
    },
    {
      id: 4,
      title: 'Interpretar analíticas de estudiantes',
      description: 'Entiende los reportes de progreso académico',
      duration: '12 min',
      category: 'analytics',
      roles: ['TEACHER', 'ADMIN_ESCOLAR']
    },
    {
      id: 5,
      title: 'Participar en juegos como estudiante',
      description: 'Guía completa para estudiantes',
      duration: '6 min',
      category: 'games',
      roles: ['STUDENT']
    }
  ]

  const contactOptions = [
    {
      id: 1,
      title: 'Soporte Técnico',
      description: 'Problemas técnicos, bugs o errores',
      contact: 'soporte@edu21.cl',
      phone: '+56 2 2345 6789',
      hours: 'Lun-Vie 9:00-18:00'
    },
    {
      id: 2,
      title: 'Soporte Pedagógico',
      description: 'Dudas sobre uso educativo y metodológico',
      contact: 'pedagogia@edu21.cl',
      phone: '+56 2 2345 6790',
      hours: 'Lun-Vie 8:00-17:00'
    },
    {
      id: 3,
      title: 'Administración',
      description: 'Cuentas, facturación y configuración escolar',
      contact: 'admin@edu21.cl',
      phone: '+56 2 2345 6791',
      hours: 'Lun-Vie 9:00-17:00'
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    (faq.roles.includes('ALL') || faq.roles.includes(user?.role || '')) &&
    (searchQuery === '' || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.roles.includes('ALL') || tutorial.roles.includes(user?.role || '')
  )

  const tabs = [
    { id: 'faq', name: 'Preguntas Frecuentes', icon: QuestionMarkCircleIcon },
    { id: 'tutorials', name: 'Tutoriales', icon: VideoCameraIcon },
    { id: 'contact', name: 'Contacto', icon: ChatBubbleLeftRightIcon }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Centro de Ayuda 🆘</h1>
          <p className="mt-2 opacity-90">
            ¡Hola {fullName}! Encuentra respuestas, tutoriales y soporte para EDU21
          </p>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Preguntas Frecuentes
                </h2>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-3 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-700 mt-2">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tutorials Tab */}
            {activeTab === 'tutorials' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Tutoriales y Guías
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTutorials.map((tutorial) => (
                    <div key={tutorial.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <PlayIcon className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {tutorial.duration}
                            </span>
                            <Button size="sm">
                              Ver Tutorial
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Contacto y Soporte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {contactOptions.map((option) => (
                    <div key={option.id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-2">{option.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          <a href={`mailto:${option.contact}`} className="text-sm text-blue-600 hover:underline">
                            {option.contact}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${option.phone}`} className="text-sm text-blue-600 hover:underline">
                            {option.phone}
                          </a>
                        </div>
                        <div className="text-xs text-gray-500">
                          {option.hours}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-medium text-blue-900 mb-2">¿Necesitas ayuda inmediata?</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Nuestro equipo de soporte está disponible para ayudarte. También puedes revisar nuestras redes sociales para actualizaciones y consejos.
                  </p>
                  <div className="space-x-3">
                    <Button variant="outline" size="sm">
                      Chat en Vivo
                    </Button>
                    <Button variant="outline" size="sm">
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <BookOpenIcon className="h-5 w-5" />
              <span className="text-sm">Manual de Usuario</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <VideoCameraIcon className="h-5 w-5" />
              <span className="text-sm">Videos Tutoriales</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span className="text-sm">Foro Comunidad</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
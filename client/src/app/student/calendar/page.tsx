'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { 
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

export default function StudentCalendar() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month')

  const events = [
    {
      id: 1,
      title: 'Evaluación de Matemáticas',
      type: 'test',
      subject: 'Matemáticas',
      date: '2024-01-25T10:00:00Z',
      duration: 90,
      teacher: 'Prof. García',
      location: 'Sala 201'
    },
    {
      id: 2,
      title: 'Entrega Ensayo Historia',
      type: 'assignment',
      subject: 'Historia',
      date: '2024-01-23T23:59:00Z',
      teacher: 'Prof. Rodríguez'
    },
    {
      id: 3,
      title: 'Clase de Ciencias - Laboratorio',
      type: 'class',
      subject: 'Ciencias',
      date: '2024-01-26T14:00:00Z',
      duration: 45,
      teacher: 'Prof. Martínez',
      location: 'Laboratorio'
    },
    {
      id: 4,
      title: 'Presentación Oral Inglés',
      type: 'presentation',
      subject: 'Inglés',
      date: '2024-01-29T11:30:00Z',
      duration: 30,
      teacher: 'Prof. Brown',
      location: 'Sala 105'
    }
  ]

  const schedule = {
    monday: [
      { subject: 'Matemáticas', time: '08:00-08:45', teacher: 'Prof. García', room: '201' },
      { subject: 'Historia', time: '08:50-09:35', teacher: 'Prof. Rodríguez', room: '105' },
      { subject: 'Recreo', time: '09:35-09:50', type: 'break' },
      { subject: 'Ciencias', time: '09:50-10:35', teacher: 'Prof. Martínez', room: 'Lab' },
      { subject: 'Lenguaje', time: '10:40-11:25', teacher: 'Prof. Silva', room: '102' }
    ],
    tuesday: [
      { subject: 'Inglés', time: '08:00-08:45', teacher: 'Prof. Brown', room: '103' },
      { subject: 'Matemáticas', time: '08:50-09:35', teacher: 'Prof. García', room: '201' },
      { subject: 'Recreo', time: '09:35-09:50', type: 'break' },
      { subject: 'Ed. Física', time: '09:50-10:35', teacher: 'Prof. López', room: 'Gimnasio' },
      { subject: 'Arte', time: '10:40-11:25', teacher: 'Prof. Vargas', room: '104' }
    ]
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'test': return <DocumentTextIcon className="h-4 w-4" />
      case 'assignment': return <AcademicCapIcon className="h-4 w-4" />
      case 'class': return <UserGroupIcon className="h-4 w-4" />
      case 'presentation': return <CalendarIcon className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'test': return 'bg-red-100 text-red-800 border-red-200'
      case 'assignment': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'class': return 'bg-green-100 text-green-800 border-green-200'
      case 'presentation': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && 
           today.getMonth() === currentDate.getMonth() && 
           today.getFullYear() === currentDate.getFullYear()
  }

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 h-24"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day)
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentDate.getMonth()
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`p-2 h-24 border border-gray-200 cursor-pointer hover:bg-gray-50 ${
            isToday(day) ? 'bg-blue-50 border-blue-300' : ''
          } ${isSelected ? 'bg-primary-50 border-primary-300' : ''}`}
        >
          <div className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} más</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Mi Calendario</h1>
              <p className="mt-1 text-sm text-gray-600">
                Horarios, evaluaciones y eventos importantes
              </p>
            </div>
            <div className="flex space-x-2">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { key: 'month', label: 'Mes' },
                  { key: 'week', label: 'Semana' },
                  { key: 'day', label: 'Día' }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      viewMode === mode.key
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              {/* Calendar Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {currentDate.toLocaleDateString('es-ES', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateMonth(-1)}
                    leftIcon={<ChevronLeftIcon className="h-4 w-4" />}
                  >
                    Anterior
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateMonth(1)}
                    leftIcon={<ChevronRightIcon className="h-4 w-4" />}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                  {renderCalendarGrid()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Horario de Hoy</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {schedule.monday.map((item, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-2 rounded-lg ${
                      item.type === 'break' ? 'bg-gray-50' : 'bg-blue-50'
                    }`}>
                      <div className="text-xs font-medium text-gray-600 w-16">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                        {item.teacher && (
                          <p className="text-xs text-gray-600">{item.teacher} • {item.room}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Próximos Eventos</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-600">{event.subject}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{formatTime(event.date)}</span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth, useAuthStore } from '@/store/auth'
import type { LoginCredentials, User } from '@/types'

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Ingresa un email válido')
    .required('El email es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida')
})

// Demo users data
const demoUsers: { [key: string]: User } = {
  'profesor@demo.edu21.cl': {
    user_id: 'demo-teacher-001',
    school_id: 'demo-school-001',
    email: 'profesor@demo.edu21.cl',
    first_name: 'María',
    last_name: 'González',
    role: 'TEACHER',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  },
  'estudiante@demo.edu21.cl': {
    user_id: 'demo-student-001',
    school_id: 'demo-school-001',
    email: 'estudiante@demo.edu21.cl',
    first_name: 'Diego',
    last_name: 'Martínez',
    role: 'STUDENT',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  },
  'admin@demo.edu21.cl': {
    user_id: 'demo-admin-001',
    school_id: 'demo-school-001',
    email: 'admin@demo.edu21.cl',
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    role: 'ADMIN_ESCOLAR',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  },
  'bienestar@demo.edu21.cl': {
    user_id: 'demo-bienestar-001',
    school_id: 'demo-school-001',
    email: 'bienestar@demo.edu21.cl',
    first_name: 'Ana',
    last_name: 'López',
    role: 'BIENESTAR_ESCOLAR',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  },
  'sostenedor@demo.edu21.cl': {
    user_id: 'demo-sostenedor-001',
    school_id: null,
    email: 'sostenedor@demo.edu21.cl',
    first_name: 'Roberto',
    last_name: 'Silva',
    role: 'SOSTENEDOR',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  },
  'guardian@demo.edu21.cl': {
    user_id: 'demo-guardian-001',
    school_id: 'demo-school-001',
    email: 'guardian@demo.edu21.cl',
    first_name: 'Patricia',
    last_name: 'Morales',
    role: 'GUARDIAN',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  },
  'superadmin@demo.edu21.cl': {
    user_id: 'demo-superadmin-001',
    school_id: null,
    email: 'superadmin@demo.edu21.cl',
    first_name: 'Sistema',
    last_name: 'Administrador',
    role: 'SUPER_ADMIN_FULL',
    active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    last_login: new Date().toISOString(),
    email_verified: true,
    login_attempts: 0
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, setUser, setLoading, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
  })

  const handleDemoLogin = async (email: string) => {
    try {
      console.log('=== DEMO LOGIN START ===')
      console.log('Email:', email)
      setLoading(true)
      
      const demoUser = demoUsers[email]
      if (!demoUser) {
        throw new Error('Usuario demo no encontrado')
      }

      console.log('Demo user found:', demoUser.role, demoUser.first_name)

      // Generate simple demo token
      const demoToken = `demo-token-${Date.now()}`
      console.log('Generated token:', demoToken)
      
      // Clear any existing auth state first
      useAuthStore.getState().clearAuth()
      
      // Set new auth state
      console.log('Setting auth state...')
      useAuthStore.setState({
        user: demoUser,
        token: demoToken,
        isAuthenticated: true,
        isLoading: false
      })
      
      // Verify state was set
      const currentState = useAuthStore.getState()
      console.log('Auth state after setting:', {
        isAuthenticated: currentState.isAuthenticated,
        userRole: currentState.user?.role,
        userEmail: currentState.user?.email,
        hasToken: !!currentState.token
      })
      
      setLoading(false)
      toast.success(`¡Bienvenido ${demoUser.first_name}! (Modo Demo)`)
      
      console.log('Demo login successful, redirecting to dashboard...')
      
      // Direct redirect to appropriate dashboard
      const targetPath = demoUser.role === 'TEACHER' ? '/teacher/dashboard' : 
                        demoUser.role === 'STUDENT' ? '/student/dashboard' :
                        demoUser.role === 'ADMIN_ESCOLAR' ? '/school/dashboard' :
                        demoUser.role === 'BIENESTAR_ESCOLAR' ? '/bienestar/dashboard' :
                        demoUser.role === 'SOSTENEDOR' ? '/sostenedor/dashboard' :
                        demoUser.role === 'GUARDIAN' ? '/guardian/dashboard' :
                        demoUser.role === 'SUPER_ADMIN_FULL' ? '/admin/dashboard' : '/'
      
      console.log('Redirecting to:', targetPath)
      router.push(targetPath)
      
      console.log('=== DEMO LOGIN END ===')
      
    } catch (error) {
      setLoading(false)
      console.error('Demo login failed:', error)
      toast.error(error instanceof Error ? error.message : 'Error en login demo')
    }
  }

  const onSubmit = async (data: LoginCredentials) => {
    // Check if it's a demo account
    if (demoUsers[data.email] && data.password === 'demo123') {
      await handleDemoLogin(data.email)
      return
    }

    try {
      await login(data)
      toast.success('¡Bienvenido a EDU21!')
      // Redirect to home page which will handle role-based routing
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">E21</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Inicia sesión en EDU21
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Plataforma educativa gamificada para colegios chilenos
            </p>
          </div>

          {/* Demo Login Section */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 text-center">
              🚀 Acceso Demo Rápido
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleDemoLogin('profesor@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                👩‍🏫 Profesor - María González
              </button>
              <button
                onClick={() => handleDemoLogin('bienestar@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                💚 Bienestar Escolar - Ana López
              </button>
              <button
                onClick={() => handleDemoLogin('estudiante@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                🎓 Estudiante - Diego Martínez
              </button>
              <button
                onClick={() => handleDemoLogin('admin@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                🏫 Admin Escolar - Carlos Rodríguez
              </button>
              <button
                onClick={() => handleDemoLogin('sostenedor@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                🏢 Sostenedor - Patricia Mendoza
              </button>

              <button
                onClick={() => handleDemoLogin('guardian@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                👨‍👩‍👧‍👦 Apoderado - Patricia Morales
              </button>
              <button
                onClick={() => handleDemoLogin('superadmin@demo.edu21.cl')}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                ⚡ Super Admin - Sistema
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="profesor@colegio.cl"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`input-field pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary-600 hover:text-primary-500 focus-ring"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </div>


            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Tu colegio aún no usa EDU21?{' '}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:text-primary-500 focus-ring"
                >
                  Solicitar acceso
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-12 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">
                Transforma la educación con juegos
              </h1>
              
              <div className="space-y-4 text-lg opacity-90">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-sm">🎮</span>
                  </div>
                  <span>15+ formatos de juegos educativos</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-sm">🤖</span>
                  </div>
                  <span>Generación de contenido con IA</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-sm">📊</span>
                  </div>
                  <span>Analíticas de aprendizaje avanzadas</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-sm">🇨🇱</span>
                  </div>
                  <span>Alineado con currículo MINEDUC</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <p className="text-sm italic">
                  "EDU21 ha revolucionado la forma en que nuestros estudiantes aprenden. 
                  Los juegos interactivos han aumentado la participación en un 85%."
                </p>
                <p className="text-xs mt-2 opacity-75">
                  — María González, Directora Colegio San Patricio
                </p>
              </div>
            </div>
          </div>
          
          {/* Floating Game Icons */}
          <div className="absolute top-20 right-20 animate-bounce-slow">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          
          <div className="absolute bottom-32 right-32 animate-pulse-slow">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">🎯</span>
            </div>
          </div>
          
          <div className="absolute top-1/2 right-12 animate-bounce-slow" style={{ animationDelay: '1s' }}>
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">🏆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
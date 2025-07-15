'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { 
  TrophyIcon, 
  ChartBarIcon, 
  PlayIcon,
  HomeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function StudentGameResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, fullName } = useAuth()
  const [gameSession, setGameSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const gameId = params.id
  const finalScore = parseInt(searchParams.get('score') || '0')

  // Fetch game session data
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/game/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setGameSession(data.session)
        } else {
          toast.error('No se pudo cargar los resultados del juego')
        }
      } catch (error) {
        console.error('Error fetching game results:', error)
        toast.error('Error al cargar los resultados')
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [gameId])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Cargando resultados...</h2>
            <p className="text-gray-600">Calculando tu puntuación final</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate results based on game data
  const totalQuestions = gameSession?.quizzes?.questions?.length || 0
  const playerAccuracy = totalQuestions > 0 ? Math.round((finalScore / (totalQuestions * 100)) * 100) : 0
  const questionsCorrect = Math.round((playerAccuracy / 100) * totalQuestions)
  
  // Mock some additional data for demo purposes
  const results = {
    playerScore: finalScore,
    playerAccuracy: Math.min(playerAccuracy, 100),
    playerPosition: finalScore >= 800 ? 1 : finalScore >= 600 ? 2 : finalScore >= 400 ? 3 : 4,
    totalPlayers: 5, // Mock total players
    gameTitle: gameSession?.title || 'Juego Demo',
    questionsCorrect,
    totalQuestions,
    timeSpent: '3:45', // Mock time
    achievements: finalScore >= 800 ? [
      { name: 'Excelencia', description: 'Obtuviste más de 800 puntos', earned: true },
      { name: 'Respuesta Rápida', description: 'Respondiste con velocidad', earned: true }
    ] : finalScore >= 500 ? [
      { name: 'Buen Trabajo', description: 'Obtuviste más de 500 puntos', earned: true }
    ] : [],
    leaderboard: [
      { position: 1, name: finalScore >= 800 ? (fullName || 'Tú') : 'Ana García', score: finalScore >= 800 ? finalScore : 950, accuracy: finalScore >= 800 ? Math.min(playerAccuracy, 100) : 95, isCurrentUser: finalScore >= 800 },
      { position: 2, name: finalScore >= 600 && finalScore < 800 ? (fullName || 'Tú') : 'Carlos López', score: finalScore >= 600 && finalScore < 800 ? finalScore : 920, accuracy: finalScore >= 600 && finalScore < 800 ? Math.min(playerAccuracy, 100) : 92, isCurrentUser: finalScore >= 600 && finalScore < 800 },
      { position: 3, name: finalScore >= 400 && finalScore < 600 ? (fullName || 'Tú') : 'María Torres', score: finalScore >= 400 && finalScore < 600 ? finalScore : 850, accuracy: finalScore >= 400 && finalScore < 600 ? Math.min(playerAccuracy, 100) : 85, isCurrentUser: finalScore >= 400 && finalScore < 600 },
      { position: 4, name: finalScore < 400 ? (fullName || 'Tú') : 'Pedro Ruiz', score: finalScore < 400 ? finalScore : 780, accuracy: finalScore < 400 ? Math.min(playerAccuracy, 100) : 78, isCurrentUser: finalScore < 400 },
      { position: 5, name: 'Luis Morales', score: 720, accuracy: 72, isCurrentUser: false }
    ]
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-600'
    if (position === 2) return 'text-gray-500'
    if (position === 3) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getPositionIcon = (position: number) => {
    if (position <= 3) return <TrophyIcon className="h-5 w-5" />
    return <span className="text-sm font-bold">#{position}</span>
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
          <div className="mb-4">
            {results.playerPosition <= 3 ? (
              <TrophyIcon className="h-16 w-16 mx-auto text-yellow-300" />
            ) : (
              <StarIcon className="h-16 w-16 mx-auto text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {results.playerPosition === 1 ? '¡Felicitaciones! 🎉' :
             results.playerPosition <= 3 ? '¡Excelente trabajo! 👏' :
             '¡Buen intento! 💪'}
          </h1>
          <p className="text-xl opacity-90">
            Terminaste en el puesto {results.playerPosition} de {results.totalPlayers}
          </p>
          <p className="opacity-75">{results.gameTitle}</p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{results.playerScore}</div>
            <div className="text-sm text-gray-600">Puntuación Final</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{results.playerAccuracy}%</div>
            <div className="text-sm text-gray-600">Precisión</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {results.questionsCorrect}/{results.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Respuestas Correctas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{results.timeSpent}</div>
            <div className="text-sm text-gray-600">Tiempo Total</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Tabla de Posiciones</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {results.leaderboard.map((player) => (
                  <div
                    key={player.position}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.isCurrentUser 
                        ? 'bg-purple-50 border-2 border-purple-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 ${getPositionColor(player.position)}`}>
                        {getPositionIcon(player.position)}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          player.isCurrentUser ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {player.name}
                          {player.isCurrentUser && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              Tú
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{player.accuracy}% precisión</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{player.score}</div>
                      <div className="text-sm text-gray-500">puntos</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Logros Obtenidos</h2>
            </div>
            <div className="p-6">
              {results.achievements.length === 0 ? (
                <div className="text-center py-8">
                  <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No obtuviste logros en este juego</p>
                  <p className="text-sm text-gray-500">¡Sigue practicando para desbloquear logros!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.achievements.map((achievement, index) => (
                    <div key={index} className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">🏆</div>
                        <div>
                          <h3 className="font-medium text-yellow-800">{achievement.name}</h3>
                          <p className="text-sm text-yellow-700 mt-1">{achievement.description}</p>
                          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ✓ Conseguido
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/student/games')}
            variant="primary"
            leftIcon={<PlayIcon className="h-4 w-4" />}
          >
            Jugar Otro Juego
          </Button>
          
          <Button
            onClick={() => router.push('/student/progress')}
            variant="outline"
            leftIcon={<ChartBarIcon className="h-4 w-4" />}
          >
            Ver Mi Progreso
          </Button>
          
          <Button
            onClick={() => router.push('/student/dashboard')}
            variant="outline"
            leftIcon={<HomeIcon className="h-4 w-4" />}
          >
            Ir al Dashboard
          </Button>
        </div>

        {/* Motivational Message */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="font-medium text-blue-900 mb-2">
            {results.playerPosition === 1 ? '¡Eres el mejor de la clase!' :
             results.playerPosition <= 3 ? '¡Estás entre los mejores!' :
             results.playerAccuracy >= 80 ? '¡Excelente precisión!' :
             '¡Sigue practicando, vas muy bien!'}
          </h3>
          <p className="text-blue-800 text-sm">
            Cada juego es una oportunidad para aprender algo nuevo. ¡Sigue así!
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
} 
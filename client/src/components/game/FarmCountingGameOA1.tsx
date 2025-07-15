'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

interface FarmCountingGameOA1Props {
  gameSession: any;
  onAnswer: (questionId: string, answer: any, timeSpent: number) => void;
  onGameComplete: () => void;
}

interface QuestionData {
  id: string;
  type: string;
  question: string;
  count?: number;
  pattern?: number[];
  options: number[];
  correctAnswer: number;
  bloom: string;
  skill: string;
}

// Progresión educativa específica para MAT.1B.OA.01
const GAME_LEVELS = {
  1: {
    title: "🐣 Pollitos Pequeños (1-5)",
    description: "Aprende a contar del 1 al 5 con pollitos",
    maxNumber: 5,
    animals: ["🐣", "🐤"],
    background: "#E8F5E8",
    difficulty: "Recordar"
  },
  2: {
    title: "🐔 Gallinas Medianas (1-10)",
    description: "Cuenta del 1 al 10 con gallinas",
    maxNumber: 10,
    animals: ["🐔", "🐓", "🥚"],
    background: "#F0F8E8",
    difficulty: "Comprender"
  },
  3: {
    title: "🐄 Vacas Grandes (1-20)",
    description: "Conteo avanzado del 1 al 20",
    maxNumber: 20,
    animals: ["🐄", "🐮", "🥛"],
    background: "#E8F8F0",
    difficulty: "Aplicar"
  },
  4: {
    title: "🚜 Granjero Experto (Patrones)",
    description: "Cuenta de 2 en 2, de 5 en 5",
    maxNumber: 20,
    animals: ["🚜", "🌾", "🏠"],
    background: "#F8F0E8",
    difficulty: "Analizar"
  }
};

export default function FarmCountingGameOA1({ gameSession, onAnswer, onGameComplete }: FarmCountingGameOA1Props) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{correct: boolean, explanation: string} | null>(null);

  // Generar preguntas específicas para cada nivel
  const generateLevelQuestions = (level: number): QuestionData[] => {
    const levelConfig = GAME_LEVELS[level as keyof typeof GAME_LEVELS];
    const questions: QuestionData[] = [];

    switch (level) {
      case 1: // Conteo básico 1-5
        for (let i = 1; i <= 3; i++) {
          const count = Math.floor(Math.random() * levelConfig.maxNumber) + 1;
          questions.push({
            id: `level1_q${i}`,
            type: 'count_visual',
            question: `¿Cuántos ${levelConfig.animals[0]} ves?`,
            count: count,
            options: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= 5),
            correctAnswer: count,
            bloom: 'Recordar',
            skill: 'Conteo visual básico'
          });
        }
        break;

      case 2: // Conteo y correspondencia 1-10
        for (let i = 1; i <= 3; i++) {
          const count = Math.floor(Math.random() * levelConfig.maxNumber) + 1;
          questions.push({
            id: `level2_q${i}`,
            type: 'count_and_match',
            question: `El granjero tiene ${count} ${levelConfig.animals[0]}. ¿Cuántos son?`,
            count: count,
            options: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= 10),
            correctAnswer: count,
            bloom: 'Comprender',
            skill: 'Conteo y correspondencia'
          });
        }
        break;

      case 3: // Conteo avanzado 1-20
        for (let i = 1; i <= 3; i++) {
          const count = Math.floor(Math.random() * levelConfig.maxNumber) + 1;
          questions.push({
            id: `level3_q${i}`,
            type: 'story_problem',
            question: `En la granja hay ${count} ${levelConfig.animals[0]}. ¿Puedes contarlas todas?`,
            count: count,
            options: [count, count + 2, count - 2, count + 3].filter(n => n > 0 && n <= 20),
            correctAnswer: count,
            bloom: 'Aplicar',
            skill: 'Resolución de problemas con conteo'
          });
        }
        break;

      case 4: // Patrones de conteo
        const patterns = [
          { pattern: [2, 4, 6, 8], next: 10, description: "de 2 en 2" },
          { pattern: [5, 10, 15], next: 20, description: "de 5 en 5" },
          { pattern: [10, 8, 6], next: 4, description: "hacia atrás de 2 en 2" }
        ];
        
        patterns.forEach((p, i) => {
          questions.push({
            id: `level4_q${i + 1}`,
            type: 'pattern_counting',
            question: `¿Qué número sigue contando ${p.description}? ${p.pattern.join(', ')}, ___`,
            pattern: p.pattern,
            options: [p.next, p.next + 2, p.next - 1, p.next + 5].filter(n => n > 0 && n <= 20),
            correctAnswer: p.next,
            bloom: 'Analizar',
            skill: 'Conteo por patrones'
          });
        });
        break;
    }

    return questions;
  };

  const [levelQuestions, setLevelQuestions] = useState(() => generateLevelQuestions(currentLevel));

  const currentQuestionData = levelQuestions[currentQuestion];
  const levelConfig = GAME_LEVELS[currentLevel as keyof typeof GAME_LEVELS];

  const handleAnswer = (selectedAnswer: number) => {
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
    
    // Feedback educativo específico
    const feedback = {
      correct: isCorrect,
      explanation: isCorrect 
        ? `¡Excelente! ${currentQuestionData.correctAnswer} es correcto. Habilidad: ${currentQuestionData.skill}`
        : `No es correcto. La respuesta era ${currentQuestionData.correctAnswer}. Practica el ${currentQuestionData.skill.toLowerCase()}.`
    };

    setLastAnswer(feedback);
    setShowResult(true);

    if (isCorrect) {
      setScore(score + 100);
    }

    // Enviar respuesta al sistema
    onAnswer(currentQuestionData.id, selectedAnswer, timeSpent);

    setTimeout(() => {
      setShowResult(false);
      setLastAnswer(null);
      
      if (currentQuestion < levelQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setQuestionStartTime(Date.now());
      } else {
        // Nivel completado
        if (currentLevel < 4) {
          // Avanzar al siguiente nivel
          const nextLevel = currentLevel + 1;
          setCurrentLevel(nextLevel);
          setLevelQuestions(generateLevelQuestions(nextLevel));
          setCurrentQuestion(0);
          setQuestionStartTime(Date.now());
        } else {
          // Juego completado
          onGameComplete();
        }
      }
    }, 2000);
  };

  const renderAnimals = (count: number) => {
    const animal = levelConfig.animals[0];
    return Array.from({ length: count }, (_, i) => (
      <div 
        key={i} 
        className="text-6xl animate-bounce cursor-pointer hover:scale-110 transition-transform"
        style={{ animationDelay: `${i * 0.1}s` }}
        onClick={() => {
          // Sonido de animal simulado
          console.log(`¡${animal === '🐣' ? 'Pío pío' : animal === '🐔' ? 'Coc coc' : animal === '🐄' ? 'Muuu' : 'Bruum'}!`);
        }}
      >
        {animal}
      </div>
    ));
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: levelConfig.background }}>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-green-800">
              🌾 GRANJA CONTADOR OA1 🌾
            </h1>
            
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-green-700">
                {levelConfig.title}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {levelConfig.description}
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-blue-800">📚 Objetivo de Aprendizaje MAT.1B.OA.01:</h3>
                <p className="text-sm text-blue-700">
                  "Contar números del 0 al 20 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10"
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">🎯 Nivel de Taxonomía de Bloom:</h3>
                <p className="text-sm text-yellow-700">{levelConfig.difficulty}</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {levelConfig.animals.map((animal, i) => (
                <div key={i} className="text-8xl animate-pulse">
                  {animal}
                </div>
              ))}
            </div>

            <Button 
              onClick={() => {
                setGameStarted(true);
                setQuestionStartTime(Date.now());
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-4 rounded-full"
            >
              🚀 ¡Empezar a Contar!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: levelConfig.background }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header con progreso */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-green-800">
              {levelConfig.title}
            </h1>
            <div className="text-right">
              <div className="text-sm text-gray-600">Puntos: {score}</div>
              <div className="text-sm text-gray-600">
                Pregunta {currentQuestion + 1} de {levelQuestions.length}
              </div>
              <div className="text-sm text-gray-600">
                Nivel {currentLevel} de 4
              </div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion) / levelQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Pregunta actual */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
            {currentQuestionData.question}
          </h2>

          {/* Mostrar animales para contar */}
          {(currentQuestionData.type === 'count_visual' || currentQuestionData.type === 'count_and_match' || currentQuestionData.type === 'story_problem') && currentQuestionData.count && (
            <div className="flex flex-wrap justify-center gap-4 mb-8 p-6 bg-green-50 rounded-lg">
              {renderAnimals(currentQuestionData.count)}
            </div>
          )}

          {/* Mostrar patrón para nivel 4 */}
          {currentQuestionData.type === 'pattern_counting' && currentQuestionData.pattern && (
            <div className="text-center mb-8 p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold space-x-4">
                {currentQuestionData.pattern.map((num: number, i: number) => (
                  <span key={i} className="inline-block bg-blue-200 px-4 py-2 rounded-lg mr-2">
                    {num}
                  </span>
                ))}
                <span className="inline-block bg-yellow-200 px-4 py-2 rounded-lg border-2 border-dashed border-yellow-500">
                  ?
                </span>
              </div>
            </div>
          )}

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-4">
            {currentQuestionData.options.map((option: number) => (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                className="h-20 text-2xl font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-4 border-yellow-600 rounded-xl transform hover:scale-105 transition-all"
                disabled={showResult}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {showResult && lastAnswer && (
          <div className={`text-center p-6 rounded-xl shadow-lg ${
            lastAnswer.correct ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
          } border-4`}>
            <div className="text-6xl mb-4">
              {lastAnswer.correct ? '🎉' : '💪'}
            </div>
            <div className={`text-xl font-bold ${
              lastAnswer.correct ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastAnswer.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
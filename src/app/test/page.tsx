'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, AlertCircle } from 'lucide-react';
import { useTestStore } from '@/lib/store';
import { getShuffledQuestions, Question } from '@/lib/questions';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

/**
 * Test page - where users answer IQ questions
 * Tracks progress, time, and submits answers
 */
export default function TestPage() {
  const router = useRouter();
  const { currentSession, submitAnswer, finishTest, resetTest } = useTestStore();
  
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  // Initialize shuffled questions on mount
  useEffect(() => {
    setShuffledQuestions(getShuffledQuestions());
  }, []);

  // Redirect if no active session
  useEffect(() => {
    if (!currentSession) {
      router.push('/');
    }
  }, [currentSession, router]);

  // Sync current question index with session answers
  useEffect(() => {
    if (currentSession) {
      setCurrentQuestionIndex(currentSession.answers.length);
    }
  }, [currentSession]);

  /**
   * Handle answer submission
   */
  const handleAnswer = useCallback((selectedOption: number, timeSpent: number) => {
    if (isSubmitting || !shuffledQuestions.length) return;
    
    setIsSubmitting(true);
    
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Submit the answer
    submitAnswer({
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      timeSpent,
    });

    // Check if test is complete (this is the last question)
    if (currentQuestionIndex + 1 >= shuffledQuestions.length) {
      // Small delay to ensure state is saved before finishing
      setTimeout(() => {
        finishTest();
        setTestComplete(true);
        // Redirect after showing completion screen
        setTimeout(() => {
          router.push('/payment');
        }, 1500);
      }, 100);
    } else {
      // Move to next question after brief delay
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsSubmitting(false);
      }, 500);
    }
  }, [currentQuestionIndex, shuffledQuestions, submitAnswer, finishTest, router, isSubmitting]);

  /**
   * Handle test abandonment
   */
  const handleQuit = () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      resetTest();
      router.push('/');
    }
  };

  // Show loading state while redirecting
  if (!currentSession || shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading test...</p>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (testComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center"
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
            Test Complete!
          </h1>
          <p className="text-slate-600 mb-6">
            You answered all {shuffledQuestions.length} questions. 
            Redirecting to unlock your results...
          </p>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = currentQuestionIndex + 1;
  const totalQuestions = shuffledQuestions.length;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary-500" />
              <span className="font-display font-bold text-slate-900">IQ Test</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuit}
              className="text-slate-500 hover:text-red-500"
            >
              Quit Test
            </Button>
          </div>
          
          <ProgressBar
            current={progress}
            total={totalQuestions}
            showLabel={true}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Question card */}
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={progress}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
          isSubmitting={isSubmitting}
        />

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <Card variant="glass" padding="sm">
            <div className="flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div className="text-slate-600">
                <strong className="text-slate-700">Tip:</strong> Trust your first instinct. 
                Most people score higher when they don&apos;t overthink their answers.
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

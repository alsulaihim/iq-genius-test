'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';
import type { Question } from '@/lib/questions';
import { Card } from './Card';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: number, timeSpent: number) => void;
  isSubmitting?: boolean;
}

const categoryColors = {
  pattern: 'from-purple-500 to-pink-500',
  logic: 'from-cyan-500 to-blue-500',
  spatial: 'from-green-500 to-emerald-500',
  numerical: 'from-orange-500 to-red-500',
  verbal: 'from-yellow-500 to-amber-500',
};

const categoryLabels = {
  pattern: 'Pattern Recognition',
  logic: 'Logical Reasoning',
  spatial: 'Spatial Reasoning',
  numerical: 'Numerical Reasoning',
  verbal: 'Verbal Reasoning',
};

/**
 * Question card component with animated options
 * Tracks time spent on each question
 */
export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isSubmitting = false,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Track elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  const handleOptionClick = (index: number) => {
    if (isSubmitting) return;
    setSelectedOption(index);
    
    // Small delay before submitting for visual feedback
    setTimeout(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onAnswer(index, timeSpent);
    }, 300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="bordered" padding="lg" className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium
                bg-gradient-to-r ${categoryColors[question.category]}
              `}>
                {categoryLabels[question.category]}
              </span>
              <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : ''}
                ${question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                ${question.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' : ''}
              `}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-display font-semibold text-white mb-8 leading-relaxed">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  question-option w-full p-4 rounded-xl text-left
                  flex items-center gap-4
                  border transition-all duration-200
                  ${selectedOption === index
                    ? 'bg-primary-500/20 border-primary-500 text-white'
                    : 'bg-surface-lighter/50 border-white/5 text-slate-300 hover:border-white/20 hover:bg-surface-lighter'
                  }
                  ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              >
                {/* Option letter */}
                <span className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  font-display font-semibold text-lg flex-shrink-0
                  ${selectedOption === index
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-light text-slate-400'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                
                {/* Option text */}
                <span className="flex-grow font-medium">{option}</span>
                
                {/* Selected indicator */}
                {selectedOption === index && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary-400" />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-sm text-slate-500">
            <span>
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="flex items-center gap-1">
              Click an option to continue
            </span>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}


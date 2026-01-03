'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Question } from '@/lib/questions';
import { Card } from './Card';
import { Button } from './Button';

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
 * User must click "Next" to proceed after selecting an answer
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

  /** Handle option selection - does not auto-submit */
  const handleOptionClick = (index: number) => {
    if (isSubmitting) return;
    setSelectedOption(index);
  };

  /** Handle next button click - submits the answer */
  const handleNextClick = () => {
    if (selectedOption === null || isSubmitting) return;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onAnswer(selectedOption, timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div key={question.id}>
      <Card variant="bordered" padding="lg" className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium text-white
                bg-gradient-to-r ${categoryColors[question.category]}
              `}>
                {categoryLabels[question.category]}
              </span>
              <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
                ${question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${question.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
              `}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-display font-semibold text-slate-900 mb-8 leading-relaxed">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isSubmitting}
                className={`
                  question-option w-full p-4 rounded-xl text-left
                  flex items-center gap-4
                  border transition-all duration-200
                  ${selectedOption === index
                    ? 'bg-primary-50 border-primary-500 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
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
                    : 'bg-white border border-slate-200 text-slate-500'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                
                {/* Option text */}
                <span className="flex-grow font-medium">{option}</span>
                
                {/* Selected indicator */}
                {selectedOption === index && (
                  <span className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary-500" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Footer with Next button */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            <Button
              onClick={handleNextClick}
              disabled={selectedOption === null || isSubmitting}
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {questionNumber === totalQuestions ? 'Finish' : 'Next'}
            </Button>
          </div>
        </Card>
    </div>
  );
}

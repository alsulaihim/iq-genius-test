import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Gender options for the test
 */
export type Gender = 'male' | 'female';

/**
 * Answer record for each question
 */
export interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

/**
 * Test session data
 */
export interface TestSession {
  sessionId: string;
  gender: Gender;
  answers: Answer[];
  startTime: number;
  endTime?: number;
  rawScore: number;
  iqScore: number;
  isPaid: boolean;
  paymentId?: string;
}

/**
 * Store state interface
 */
interface TestStore {
  // Current session
  currentSession: TestSession | null;
  
  // Actions
  startTest: (gender: Gender, sessionId: string) => void;
  submitAnswer: (answer: Answer) => void;
  finishTest: () => void;
  calculateIQ: () => number;
  markAsPaid: (paymentId: string) => void;
  resetTest: () => void;
  
  // Getters
  getProgress: () => number;
  getTotalQuestions: () => number;
}

/**
 * Total number of questions in the test
 */
const TOTAL_QUESTIONS = 20;

/**
 * Calculate IQ score based on raw score
 * Uses standard IQ distribution (mean=100, SD=15)
 * 
 * @param rawScore - Number of correct answers
 * @param totalQuestions - Total number of questions
 * @returns Calculated IQ score
 */
function calculateIQFromRawScore(rawScore: number, totalQuestions: number): number {
  // Convert raw score to percentage
  const percentage = rawScore / totalQuestions;
  
  // Map percentage to IQ using approximate normal distribution
  // 50% correct = 100 IQ (average)
  // Each 6.67% difference = 15 IQ points (1 standard deviation)
  
  // Z-score calculation (simplified)
  const zScore = (percentage - 0.5) / 0.167; // 0.167 = 1/6 for each SD
  
  // Convert z-score to IQ (mean=100, SD=15)
  let iqScore = Math.round(100 + (zScore * 15));
  
  // Clamp to realistic range
  iqScore = Math.max(70, Math.min(145, iqScore));
  
  return iqScore;
}

/**
 * Zustand store for managing test state
 * Persisted to localStorage to survive page refreshes
 */
export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      
      startTest: (gender: Gender, sessionId: string) => {
        set({
          currentSession: {
            sessionId,
            gender,
            answers: [],
            startTime: Date.now(),
            rawScore: 0,
            iqScore: 0,
            isPaid: false,
          },
        });
      },
      
      submitAnswer: (answer: Answer) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const updatedAnswers = [...currentSession.answers, answer];
        const rawScore = updatedAnswers.filter(a => a.isCorrect).length;
        
        set({
          currentSession: {
            ...currentSession,
            answers: updatedAnswers,
            rawScore,
          },
        });
      },
      
      finishTest: () => {
        const { currentSession, calculateIQ } = get();
        if (!currentSession) return;
        
        const iqScore = calculateIQ();
        
        set({
          currentSession: {
            ...currentSession,
            endTime: Date.now(),
            iqScore,
          },
        });
      },
      
      calculateIQ: () => {
        const { currentSession } = get();
        if (!currentSession) return 100;
        
        return calculateIQFromRawScore(currentSession.rawScore, TOTAL_QUESTIONS);
      },
      
      markAsPaid: (paymentId: string) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        set({
          currentSession: {
            ...currentSession,
            isPaid: true,
            paymentId,
          },
        });
      },
      
      resetTest: () => {
        set({ currentSession: null });
      },
      
      getProgress: () => {
        const { currentSession } = get();
        if (!currentSession) return 0;
        return currentSession.answers.length;
      },
      
      getTotalQuestions: () => TOTAL_QUESTIONS,
    }),
    {
      name: 'iq-test-storage',
      partialize: (state) => ({ currentSession: state.currentSession }),
    }
  )
);


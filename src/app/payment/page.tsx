'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Lock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useTestStore } from '@/lib/store';
import { PayPalButton } from '@/components/PayPalButton';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

const PRICE = '9.99';

/**
 * Payment page - unlock IQ results
 * Supports PayPal and credit card payments
 */
export default function PaymentPage() {
  const router = useRouter();
  const { currentSession, markAsPaid } = useTestStore();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if no completed test
  useEffect(() => {
    if (!currentSession || !currentSession.endTime) {
      router.push('/');
    } else if (currentSession.isPaid) {
      router.push('/results');
    }
  }, [currentSession, router]);

  const handlePaymentSuccess = (paymentId: string) => {
    markAsPaid(paymentId);
    setPaymentStatus('success');
    
    // Redirect to results after brief delay
    setTimeout(() => {
      router.push('/results');
    }, 2000);
  };

  const handlePaymentError = (error: Error) => {
    setPaymentStatus('error');
    setErrorMessage(error.message || 'Payment failed. Please try again.');
    
    // Reset after delay
    setTimeout(() => {
      setPaymentStatus('idle');
      setErrorMessage('');
    }, 5000);
  };

  // Loading state
  if (!currentSession || !currentSession.endTime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStatus === 'success') {
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
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-slate-600 mb-6">
            Unlocking your personalized IQ results...
          </p>
          
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </motion.div>
      </div>
    );
  }

  const TOTAL_QUESTIONS = 20; // Fixed number of questions in the test
  const answeredQuestions = TOTAL_QUESTIONS;
  const testDuration = currentSession.endTime 
    ? Math.round((currentSession.endTime - currentSession.startTime) / 1000 / 60)
    : 0;

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary-500" />
              <span className="font-display font-bold text-slate-900">IQ Genius</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Locked results preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="bordered" className="mb-8 overflow-hidden">
            {/* Blurred preview */}
            <div className="relative p-6 text-center bg-gradient-to-b from-slate-50 to-white">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-10" />
              <div className="blur-lg select-none">
                <div className="text-7xl font-display font-bold text-primary-500 mb-2">
                  ???
                </div>
                <p className="text-xl text-slate-700">Your IQ Score</p>
              </div>
              
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-lg">
                    <Lock className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-slate-900 font-medium">Unlock Your Results</p>
                </div>
              </div>
            </div>

            {/* Test summary */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-200 bg-slate-50">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-display font-bold text-slate-900">
                    {answeredQuestions}
                  </p>
                  <p className="text-xs text-slate-500">Questions Answered</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-slate-900">
                    {testDuration} min
                  </p>
                  <p className="text-xs text-slate-500">Test Duration</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* What you'll get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-display font-semibold text-slate-900 mb-4 text-center">
            What You&apos;ll Get:
          </h2>
          
          <ul className="space-y-3">
            {[
              'Your precise IQ score with detailed breakdown',
              'Global percentile ranking',
              'Gender-specific comparison statistics',
              'Cognitive strengths analysis',
              'Personalized career recommendations',
              'Brain improvement tips',
              'Famous people with similar IQ',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Opposite Gender Perception Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card variant="bordered" className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900 mb-1">
                  🔓 Bonus: Gender Perception Insights
                </h3>
                <p className="text-sm text-slate-600">
                  {currentSession?.gender === 'female' 
                    ? "Curious what most men think about a score like yours?"
                    : "Curious what most women think about a score like yours?"
                  }
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">
                  Research-backed insights included with your results!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Payment section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="bordered" padding="lg" className="overflow-visible">
            <h2 className="text-xl font-display font-semibold text-slate-900 mb-6 text-center">
              Unlock Your IQ Results
            </h2>

            {/* Error message */}
            {paymentStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 font-medium">Payment Failed</p>
                  <p className="text-red-600/70 text-sm">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* PayPal button */}
            <PayPalButton
              amount={PRICE}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Card>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-slate-500"
        >
          <p>
            Questions? Contact us at{' '}
            <a href="mailto:support@iqgenius.com" className="text-primary-600 hover:underline">
              support@iqgenius.com
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

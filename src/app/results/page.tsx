'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Share2, 
  Download, 
  Trophy, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Target,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useTestStore } from '@/lib/store';
import { getPersonalizedInsights, worldStats } from '@/lib/statistics';
import { IQGauge } from '@/components/IQGauge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { CircularProgress } from '@/components/ProgressBar';

/**
 * Results page - displays IQ score and personalized insights
 * Only accessible after successful payment
 */
export default function ResultsPage() {
  const router = useRouter();
  const { currentSession, resetTest } = useTestStore();
  const [showDetails, setShowDetails] = useState(false);

  // Redirect if no paid session
  useEffect(() => {
    if (!currentSession || !currentSession.isPaid) {
      router.push('/');
    }
  }, [currentSession, router]);

  // Loading state
  if (!currentSession || !currentSession.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-primary-400 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  const insights = getPersonalizedInsights(currentSession.iqScore, currentSession.gender);
  const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length;
  const totalQuestions = currentSession.answers.length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  const handleRetakeTest = () => {
    resetTest();
    router.push('/');
  };

  const handleShare = async () => {
    const text = `I just scored ${currentSession.iqScore} on the IQ Genius Test! That puts me in the top ${100 - insights.percentile}% globally. Take the test yourself!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My IQ Score - IQ Genius',
          text,
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary-400" />
              <span className="font-display font-bold text-white">Your Results</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Score Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Congratulations badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: insights.classification.color + '20' }}
          >
            <Trophy className="w-4 h-4" style={{ color: insights.classification.color }} />
            <span className="text-sm font-medium" style={{ color: insights.classification.color }}>
              {insights.classification.label}
            </span>
          </motion.div>

          {/* IQ Gauge */}
          <IQGauge score={currentSession.iqScore} />

          {/* Classification description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-slate-400 mt-4 max-w-md mx-auto"
          >
            {insights.classification.description}
          </motion.p>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { 
              label: 'Percentile', 
              value: `${insights.percentile}%`, 
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-primary-400'
            },
            { 
              label: 'Correct', 
              value: `${correctAnswers}/${totalQuestions}`, 
              icon: <Target className="w-5 h-5" />,
              color: 'text-green-400'
            },
            { 
              label: 'Accuracy', 
              value: `${accuracy}%`, 
              icon: <Sparkles className="w-5 h-5" />,
              color: 'text-accent-purple'
            },
            { 
              label: 'vs Global', 
              value: currentSession.iqScore > 100 ? `+${currentSession.iqScore - 100}` : `${currentSession.iqScore - 100}`, 
              icon: <Users className="w-5 h-5" />,
              color: currentSession.iqScore >= 100 ? 'text-green-400' : 'text-amber-400'
            },
          ].map((stat, index) => (
            <Card key={index} variant="bordered" padding="md" className="text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-display font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </Card>
          ))}
        </motion.section>

        {/* Gender Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" />
                How You Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {insights.comparisonText}
              </p>
              
              <div className="bg-surface-lighter rounded-xl p-4">
                <p className="text-sm text-slate-400 mb-2">
                  {insights.genderStats.notableInsight}
                </p>
                <p className="text-sm text-primary-400">
                  {insights.genderStats.encouragement}
                </p>
              </div>

              {/* Strength areas */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-300 mb-3">
                  Typical strengths for your demographic:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.genderStats.strengthAreas.map((strength, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-xs text-primary-400"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Career Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-gold" />
                Recommended Career Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                Based on your cognitive profile, you may excel in:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {insights.careerSuggestions.map((career, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-surface-lighter rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-gold" />
                    <span className="text-slate-300">{career}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Improvement Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent-purple" />
                Brain Boosting Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.improvementTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* World Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Global Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(worldStats.countries).map(([key, country]) => (
                  <div key={key} className="text-center p-4 bg-surface-lighter rounded-xl">
                    <p className="text-2xl font-display font-bold text-white mb-1">
                      {country.avgIQ}
                    </p>
                    <p className="text-xs text-slate-400">{country.name}</p>
                    {currentSession.iqScore > country.avgIQ && (
                      <p className="text-xs text-green-400 mt-1">
                        You: +{currentSession.iqScore - country.avgIQ}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              {currentSession.iqScore >= worldStats.mensaThreshold && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-gradient-to-r from-accent-gold/10 to-orange-500/10 border border-accent-gold/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-accent-gold" />
                    <div>
                      <p className="font-display font-semibold text-white">
                        Mensa Eligible!
                      </p>
                      <p className="text-sm text-slate-400">
                        Your score qualifies you for Mensa membership (top 2%)
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleShare}
            leftIcon={<Share2 className="w-5 h-5" />}
          >
            Share Results
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={handleRetakeTest}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            Take Test Again
          </Button>
        </motion.section>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          <p>
            Results are based on your performance on this test and should be considered 
            an estimate. For official IQ testing, consult a licensed psychologist.
          </p>
        </motion.div>
      </main>
    </div>
  );
}


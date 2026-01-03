'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Trophy, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Target,
  Sparkles,
  Star,
  Award
} from 'lucide-react';
import { IQGauge } from '@/components/IQGauge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { 
  getIQClassification, 
  calculatePercentile, 
  getPersonalizedInsights,
  worldStats,
  getFamousPeopleByIQ
} from '@/lib/statistics';
import { Gender } from '@/lib/store';

/**
 * Demo Results Page - For previewing gauge at different IQ scores
 * Access at /demo-results
 * DELETE THIS FILE BEFORE PRODUCTION
 */
export default function DemoResultsPage() {
  const [score, setScore] = useState(100);
  const [gender, setGender] = useState<Gender>('male');
  
  const classification = getIQClassification(score);
  const percentile = calculatePercentile(score, gender);
  const insights = getPersonalizedInsights(score, gender);
  const famousPeople = getFamousPeopleByIQ(score);
  
  // Mock test data
  const correctAnswers = Math.round((score - 70) / 75 * 20);
  const totalQuestions = 20;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  const presetScores = [70, 85, 100, 115, 130, 145];

  return (
    <div className="min-h-screen bg-surface pb-16">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary-500" />
            <span className="font-display font-bold text-slate-900">Demo Results Preview</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <h2 className="text-lg font-display font-bold text-slate-800 mb-4">
            🎛️ Preview Controls
          </h2>
          
          {/* Gender Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('male')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Female
              </button>
            </div>
          </div>
          
          {/* Slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              IQ Score: <span className="text-primary-500 font-bold">{score}</span>
            </label>
            <input
              type="range"
              min="70"
              max="145"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>70</span>
              <span>85</span>
              <span>100</span>
              <span>115</span>
              <span>130</span>
              <span>145</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {presetScores.map((preset) => (
              <button
                key={preset}
                onClick={() => setScore(preset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  score === preset
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Score Section */}
        <motion.section
          key={score}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          {/* Classification badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: classification.color + '15' }}
          >
            <Trophy className="w-4 h-4" style={{ color: classification.color }} />
            <span className="text-sm font-medium" style={{ color: classification.color }}>
              {classification.label}
            </span>
          </div>

          {/* IQ Gauge */}
          <IQGauge score={score} animated={false} />

          {/* Classification description */}
          <p className="text-slate-600 mt-4 max-w-md mx-auto">
            {classification.description}
          </p>
        </motion.section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Percentile', 
              value: `${percentile}%`, 
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-primary-500'
            },
            { 
              label: 'Correct', 
              value: `${correctAnswers}/${totalQuestions}`, 
              icon: <Target className="w-5 h-5" />,
              color: 'text-green-500'
            },
            { 
              label: 'Accuracy', 
              value: `${accuracy}%`, 
              icon: <Sparkles className="w-5 h-5" />,
              color: 'text-accent-purple'
            },
            { 
              label: 'vs Global', 
              value: score >= 100 ? `+${score - 100}` : `${score - 100}`, 
              icon: <Users className="w-5 h-5" />,
              color: score >= 100 ? 'text-green-500' : 'text-amber-500'
            },
          ].map((stat, index) => (
            <Card key={index} variant="bordered" padding="md" className="text-center">
              <div className={`${stat.color} mb-2 flex justify-center`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-display font-bold text-slate-900">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </Card>
          ))}
        </section>

        {/* Famous People with Similar IQ */}
        <section className="mb-8">
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-gold" />
                Famous People with Similar IQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                You share similar cognitive abilities with these notable figures:
              </p>
              {famousPeople.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {famousPeople.map((person, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 truncate">{person.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full flex-shrink-0">
                            IQ {person.iq}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{person.profession}</p>
                        <p className="text-xs text-slate-400 truncate">{person.achievement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">
                  No famous people data available for this IQ range.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Gender Comparison */}
        <section className="mb-8">
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                How You Compare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                {insights.comparisonText}
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-2">
                  {insights.genderStats.notableInsight}
                </p>
                <p className="text-sm text-primary-600">
                  {insights.genderStats.encouragement}
                </p>
              </div>

              {/* Strength areas */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">
                  Typical strengths for your demographic:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.genderStats.strengthAreas.map((strength, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 border border-primary-200 rounded-full text-xs text-primary-700"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Career Suggestions */}
        <section className="mb-8">
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-gold" />
                Recommended Career Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Based on your cognitive profile, you may excel in:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {insights.careerSuggestions.map((career, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent-gold" />
                    <span className="text-slate-700">{career}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Improvement Tips */}
        <section className="mb-8">
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
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-accent-purple text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* World Comparison */}
        <section className="mb-8">
          <Card variant="bordered" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                Global Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(worldStats.countries).map(([key, country]) => (
                  <div key={key} className="text-center p-4 bg-slate-50 rounded-xl">
                    <p className="text-2xl font-display font-bold text-slate-900 mb-1">
                      {country.avgIQ}
                    </p>
                    <p className="text-xs text-slate-500">{country.name}</p>
                    {score > country.avgIQ && (
                      <p className="text-xs text-green-500 mt-1">
                        You: +{score - country.avgIQ}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              {score >= worldStats.mensaThreshold && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-accent-gold" />
                    <div>
                      <p className="font-display font-semibold text-slate-900">
                        Mensa Eligible!
                      </p>
                      <p className="text-sm text-slate-600">
                        Your score qualifies you for Mensa membership (top 2%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Delete Notice */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600 text-sm">
            ⚠️ <strong>Demo Page</strong> - Delete this file before going to production!
            <br />
            Path: <code className="bg-red-100 px-1 rounded">src/app/demo-results/page.tsx</code>
          </p>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { IQGauge } from '@/components/IQGauge';
import { getIQClassification, calculatePercentile } from '@/lib/statistics';

/**
 * Demo Results Page - For previewing gauge at different IQ scores
 * Access at /demo-results
 * DELETE THIS FILE BEFORE PRODUCTION
 */
export default function DemoResultsPage() {
  const [score, setScore] = useState(100);
  const classification = getIQClassification(score);
  const percentile = calculatePercentile(score, 'male');

  const presetScores = [70, 85, 100, 115, 130, 145];

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-4">
            🎛️ Demo Results Preview
          </h1>
          <p className="text-slate-600 mb-6">
            Adjust the score to preview how the gauge looks at different IQ levels.
          </p>
          
          {/* Slider */}
          <div className="mb-6">
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

        {/* Results Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Classification Badge */}
          <div className="flex justify-center mb-8">
            <div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold"
              style={{ 
                backgroundColor: `${classification.color}15`,
                color: classification.color 
              }}
            >
              <span className="text-2xl">🏆</span>
              {classification.label}
            </div>
          </div>

          {/* Gauge */}
          <IQGauge score={score} animated={false} />

          {/* Description */}
          <p className="text-center text-slate-600 mt-6 text-lg max-w-md mx-auto">
            {classification.description}
          </p>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-500">{percentile}%</div>
              <div className="text-sm text-slate-600">Percentile</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-500">{classification.label}</div>
              <div className="text-sm text-slate-600">Classification</div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-slate-100 rounded-lg text-xs text-slate-500 font-mono">
            <div>Score: {score}</div>
            <div>Classification: {classification.label}</div>
            <div>Percentile: {percentile}%</div>
            <div>Color: {classification.color}</div>
          </div>
        </div>

        {/* Delete Notice */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600 text-sm">
            ⚠️ <strong>Demo Page</strong> - Delete this file before going to production!
            <br />
            Path: <code className="bg-red-100 px-1 rounded">src/app/demo-results/page.tsx</code>
          </p>
        </div>
      </div>
    </div>
  );
}


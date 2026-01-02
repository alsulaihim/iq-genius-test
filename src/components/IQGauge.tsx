'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IQGaugeProps {
  score: number;
  animated?: boolean;
}

/**
 * Animated IQ score gauge visualization
 * Shows score on a semicircular dial with gradient colors
 */
export function IQGauge({ score, animated = true }: IQGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  
  // Animate score count up
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  // Calculate rotation based on score (70-145 range mapped to 0-180 degrees)
  const minScore = 70;
  const maxScore = 145;
  const normalizedScore = Math.max(minScore, Math.min(maxScore, score));
  const rotation = ((normalizedScore - minScore) / (maxScore - minScore)) * 180;

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 130) return '#fbbf24'; // Gold
    if (score >= 115) return '#a855f7'; // Purple
    if (score >= 100) return '#0ea5e9'; // Blue
    if (score >= 85) return '#10b981'; // Green
    return '#f59e0b'; // Amber
  };

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* SVG Gauge */}
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="75%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Colored progress arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.33" // Circumference of semicircle
          initial={{ strokeDashoffset: 251.33 }}
          animate={{ 
            strokeDashoffset: animated ? 251.33 - (rotation / 180) * 251.33 : 251.33 - (rotation / 180) * 251.33 
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
          filter="url(#glow)"
        />
        
        {/* Tick marks */}
        {[70, 85, 100, 115, 130, 145].map((tick, index) => {
          const tickRotation = ((tick - minScore) / (maxScore - minScore)) * 180 - 90;
          const x1 = 100 + 65 * Math.cos((tickRotation * Math.PI) / 180);
          const y1 = 100 + 65 * Math.sin((tickRotation * Math.PI) / 180);
          const x2 = 100 + 75 * Math.cos((tickRotation * Math.PI) / 180);
          const y2 = 100 + 75 * Math.sin((tickRotation * Math.PI) / 180);
          
          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <text
                x={100 + 55 * Math.cos((tickRotation * Math.PI) / 180)}
                y={100 + 55 * Math.sin((tickRotation * Math.PI) / 180)}
                fill="#64748b"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          );
        })}
        
        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation - 90 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <polygon
            points="100,30 95,100 105,100"
            fill={getScoreColor()}
            filter="url(#glow)"
          />
        </motion.g>
        
        {/* Center circle */}
        <circle
          cx="100"
          cy="100"
          r="12"
          fill="#f8fafc"
          stroke={getScoreColor()}
          strokeWidth="3"
        />
      </svg>
      
      {/* Score display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-4"
      >
        <div className="text-6xl font-display font-bold" style={{ color: getScoreColor() }}>
          {displayScore}
        </div>
        <div className="text-slate-600 text-sm mt-1">Your IQ Score</div>
      </motion.div>
    </div>
  );
}


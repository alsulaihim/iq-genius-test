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

  // Calculate rotation based on score (70-145 range mapped to left-to-right arc)
  const minScore = 70;
  const maxScore = 145;
  const normalizedScore = Math.max(minScore, Math.min(maxScore, score));
  // Map score to angle: 70 = 180° (left), 145 = 0° (right)
  const mathAngle = 180 - ((normalizedScore - minScore) / (maxScore - minScore)) * 180;
  // Convert to CSS rotation (needle points UP at 0deg, LEFT at -90deg, RIGHT at 90deg)
  const needleRotation = 90 - mathAngle;

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
            strokeDashoffset: 251.33 - ((180 - mathAngle) / 180) * 251.33
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
          filter="url(#glow)"
        />
        
        {/* Tick marks */}
        {[70, 85, 100, 115, 130, 145].map((tick) => {
          // Map tick to angle: 70 = 180° (left), 145 = 0° (right)
          const tickAngle = 180 - ((tick - minScore) / (maxScore - minScore)) * 180;
          const angleRad = (tickAngle * Math.PI) / 180;
          // Position tick marks along the arc (subtract Y for SVG coordinate system)
          const x1 = 100 + 65 * Math.cos(angleRad);
          const y1 = 100 - 65 * Math.sin(angleRad);
          const x2 = 100 + 75 * Math.cos(angleRad);
          const y2 = 100 - 75 * Math.sin(angleRad);
          
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
                x={100 + 52 * Math.cos(angleRad)}
                y={100 - 52 * Math.sin(angleRad)}
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
          animate={{ rotate: needleRotation }}
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


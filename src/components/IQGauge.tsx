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
 * Uses mathematical calculation for needle position (not CSS transforms)
 */
export function IQGauge({ score, animated = true }: IQGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [animatedAngle, setAnimatedAngle] = useState(-90); // Start at far left
  
  // Constants for the gauge
  const centerX = 100;
  const centerY = 100;
  const needleLength = 60; // Length from center to tip
  const minScore = 70;
  const maxScore = 145;
  
  // Calculate final angle based on score
  // Score 70 = -90° (pointing left), Score 145 = 90° (pointing right)
  const normalizedScore = Math.max(minScore, Math.min(maxScore, score));
  const finalAngle = -90 + ((normalizedScore - minScore) / (maxScore - minScore)) * 180;

  // Animate score count up and needle rotation
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setAnimatedAngle(finalAngle);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const scoreIncrement = score / steps;
    const angleIncrement = (finalAngle - (-90)) / steps;
    let currentScore = 0;
    let currentAngle = -90;

    const timer = setInterval(() => {
      currentScore += scoreIncrement;
      currentAngle += angleIncrement;
      
      if (currentScore >= score) {
        setDisplayScore(score);
        setAnimatedAngle(finalAngle);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(currentScore));
        setAnimatedAngle(currentAngle);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated, finalAngle]);

  // Calculate needle tip position based on angle (in degrees)
  // -90° = pointing left, 0° = pointing up, 90° = pointing right
  const angleRad = (animatedAngle * Math.PI) / 180;
  const tipX = centerX + needleLength * Math.sin(angleRad);
  const tipY = centerY - needleLength * Math.cos(angleRad);
  
  // Calculate needle base corners (perpendicular to needle direction)
  // Perpendicular direction is (cos(θ), sin(θ)) when needle points (sin(θ), -cos(θ))
  const baseWidth = 10;
  const baseLeftX = centerX + (baseWidth / 2) * Math.cos(angleRad);
  const baseLeftY = centerY + (baseWidth / 2) * Math.sin(angleRad);
  const baseRightX = centerX - (baseWidth / 2) * Math.cos(angleRad);
  const baseRightY = centerY - (baseWidth / 2) * Math.sin(angleRad);

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 130) return '#fbbf24'; // Gold
    if (score >= 115) return '#a855f7'; // Purple
    if (score >= 100) return '#0ea5e9'; // Blue
    if (score >= 85) return '#10b981'; // Green
    return '#f59e0b'; // Amber
  };

  // Calculate progress arc dashoffset
  const arcLength = 251.33; // Approximate semicircle arc length
  const progressRatio = (normalizedScore - minScore) / (maxScore - minScore);
  const dashOffset = arcLength - progressRatio * arcLength;

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* SVG Gauge */}
      <svg viewBox="0 0 200 130" className="w-full">
        {/* Gradient and filter definitions */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="75%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          
          {/* Drop shadow for needle */}
          <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>
        
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        
        {/* Colored progress arc */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={arcLength}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: animated ? dashOffset : dashOffset }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        
        {/* Tick marks and labels */}
        {[70, 85, 100, 115, 130, 145].map((tick) => {
          const tickRatio = (tick - minScore) / (maxScore - minScore);
          const tickAngle = -90 + tickRatio * 180;
          const tickAngleRad = (tickAngle * Math.PI) / 180;
          
          // Outer tick position
          const outerRadius = 75;
          const innerRadius = 65;
          const labelRadius = 52;
          
          const x1 = centerX + innerRadius * Math.sin(tickAngleRad);
          const y1 = centerY - innerRadius * Math.cos(tickAngleRad);
          const x2 = centerX + outerRadius * Math.sin(tickAngleRad);
          const y2 = centerY - outerRadius * Math.cos(tickAngleRad);
          const labelX = centerX + labelRadius * Math.sin(tickAngleRad);
          const labelY = centerY - labelRadius * Math.cos(tickAngleRad);
          
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
                x={labelX}
                y={labelY}
                fill="#64748b"
                fontSize="9"
                fontWeight="500"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          );
        })}
        
        {/* Center circle background - drawn first */}
        <circle
          cx={centerX}
          cy={centerY}
          r="16"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        
        {/* Needle - calculated mathematically, base is exactly at center */}
        <polygon
          points={`${tipX},${tipY} ${baseLeftX},${baseLeftY} ${baseRightX},${baseRightY}`}
          fill={getScoreColor()}
          filter="url(#needleShadow)"
        />
        
        {/* Center colored circle - sits on top of needle base */}
        <circle
          cx={centerX}
          cy={centerY}
          r="10"
          fill={getScoreColor()}
        />
        
        {/* White inner dot for depth effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill="white"
        />
      </svg>
      
      {/* Score display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-2"
      >
        <div className="text-6xl font-display font-bold" style={{ color: getScoreColor() }}>
          {displayScore}
        </div>
        <div className="text-slate-600 text-sm mt-1">Your IQ Score</div>
      </motion.div>
    </div>
  );
}

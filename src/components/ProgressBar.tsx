'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

/**
 * Animated progress bar component
 * Shows test completion progress with glow effect
 */
export function ProgressBar({
  current,
  total,
  showLabel = true,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-600 font-medium">
            Question {current} of {total}
          </span>
          <span className="text-sm font-mono text-primary-600">
            {percentage}%
          </span>
        </div>
      )}
      
      <div className={`
        w-full bg-slate-200 rounded-full overflow-hidden
        ${sizeStyles[size]}
      `}>
        <motion.div
          className={`
            h-full rounded-full
            bg-gradient-to-r from-primary-500 via-accent-purple to-accent-pink
            ${animated ? 'progress-glow' : ''}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}

/**
 * Circular progress indicator
 */
export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-bold text-slate-900">
          {percentage}%
        </span>
        {label && (
          <span className="text-xs text-slate-500 mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

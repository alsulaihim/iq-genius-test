'use client';

import { motion } from 'framer-motion';
import type { Gender } from '@/lib/store';

interface GenderSelectProps {
  selected: Gender | null;
  onSelect: (gender: Gender) => void;
}

const genderOptions: { value: Gender; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'male',
    label: 'Male',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="14" r="5" />
        <path d="M19 5l-5.4 5.4" />
        <path d="M15 5h4v4" />
      </svg>
    ),
    description: 'Compare with male statistics',
  },
  {
    value: 'female',
    label: 'Female',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="5" />
        <path d="M12 13v8" />
        <path d="M9 18h6" />
      </svg>
    ),
    description: 'Compare with female statistics',
  },
];

/**
 * Gender selection component for personalized statistics
 */
export function GenderSelect({ selected, onSelect }: GenderSelectProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-display font-semibold text-white mb-2">
          Select Your Gender
        </h3>
        <p className="text-sm text-slate-400">
          This helps us provide personalized statistics and insights
        </p>
      </div>
      
      <div className="grid gap-4 grid-cols-2">
        {genderOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onSelect(option.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-6 rounded-2xl border-2 transition-all duration-200
              flex flex-col items-center text-center
              ${selected === option.value
                ? 'bg-primary-500/20 border-primary-500 text-white'
                : 'bg-surface-light border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }
            `}
          >
            {/* Selection indicator */}
            {selected === option.value && (
              <motion.div
                layoutId="genderSelector"
                className="absolute inset-0 rounded-2xl border-2 border-primary-500"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* Icon */}
            <div className={`
              mb-3 p-3 rounded-xl
              ${selected === option.value ? 'bg-primary-500/30' : 'bg-surface-lighter'}
            `}>
              {option.icon}
            </div>
            
            {/* Label */}
            <span className="font-medium text-white">{option.label}</span>
            
            {/* Description */}
            <span className="text-xs text-slate-500 mt-1">
              {option.description}
            </span>
            
            {/* Checkmark */}
            {selected === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3"
              >
                <svg
                  className="w-6 h-6 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}


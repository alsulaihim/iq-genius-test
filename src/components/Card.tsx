'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'bordered' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-white shadow-sm',
  glass: 'bg-white/80 backdrop-blur-xl border border-slate-200',
  bordered: 'bg-white border border-slate-200 shadow-sm',
  glow: 'bg-white glow-primary shadow-sm',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Animated card component with glass morphism variants
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`
          rounded-2xl
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card header component
 */
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card title component
 */
export function CardTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-display font-semibold text-slate-900 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Card description component
 */
export function CardDescription({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-slate-600 mt-1 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Card content component
 */
export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Card footer component
 */
export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-200 ${className}`}>
      {children}
    </div>
  );
}


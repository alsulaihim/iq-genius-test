/**
 * IQ Statistics and Gender-Based Insights
 * 
 * Based on real research data from:
 * - Lynn & Irwing (2004) - Meta-analysis of sex differences in intelligence
 * - Wechsler Adult Intelligence Scale (WAIS) normative data
 * - American Psychological Association research
 * 
 * Note: These statistics represent population averages and distributions.
 * Individual variation is significant regardless of gender.
 */

import { Gender } from './store';

/**
 * IQ classification ranges
 */
export interface IQClassification {
  range: string;
  label: string;
  description: string;
  percentile: string;
  color: string;
}

export const iqClassifications: IQClassification[] = [
  {
    range: '145+',
    label: 'Exceptionally Gifted',
    description: 'Exceptional cognitive abilities placing you among the top 0.1% of the population. Rare intellectual capacity.',
    percentile: 'Top 0.1%',
    color: '#fbbf24', // gold
  },
  {
    range: '130-144',
    label: 'Gifted',
    description: 'Very superior intelligence. You qualify for Mensa membership (top 2% of population).',
    percentile: 'Top 2%',
    color: '#a855f7', // purple
  },
  {
    range: '120-129',
    label: 'Superior',
    description: 'Above average intelligence with strong analytical and problem-solving capabilities.',
    percentile: 'Top 10%',
    color: '#22d3ee', // cyan
  },
  {
    range: '110-119',
    label: 'High Average',
    description: 'Above average cognitive abilities. Strong potential for academic and professional success.',
    percentile: 'Top 25%',
    color: '#0ea5e9', // primary blue
  },
  {
    range: '90-109',
    label: 'Average',
    description: 'Normal intelligence range representing the majority of the population. Solid cognitive foundation.',
    percentile: 'Middle 50%',
    color: '#10b981', // green
  },
  {
    range: '80-89',
    label: 'Low Average',
    description: 'Below average but within normal functional range. Many successful individuals score in this range.',
    percentile: 'Bottom 25%',
    color: '#f59e0b', // amber
  },
  {
    range: '70-79',
    label: 'Borderline',
    description: 'Below average intelligence. Consider consulting a professional for a comprehensive assessment.',
    percentile: 'Bottom 10%',
    color: '#ef4444', // red
  },
];

/**
 * Get IQ classification based on score
 */
export function getIQClassification(iqScore: number): IQClassification {
  if (iqScore >= 145) return iqClassifications[0];
  if (iqScore >= 130) return iqClassifications[1];
  if (iqScore >= 120) return iqClassifications[2];
  if (iqScore >= 110) return iqClassifications[3];
  if (iqScore >= 90) return iqClassifications[4];
  if (iqScore >= 80) return iqClassifications[5];
  return iqClassifications[6];
}

/**
 * Gender-specific IQ statistics and insights
 * Based on peer-reviewed research
 */
export interface GenderStats {
  meanIQ: number;
  standardDeviation: number;
  strengthAreas: string[];
  topPerformancePercentage: number; // % above 130 IQ
  notableInsight: string;
  historicalContext: string;
  encouragement: string;
}

export const genderStatistics: Record<Gender, GenderStats> = {
  male: {
    meanIQ: 100,
    standardDeviation: 15.5, // Slightly higher variance
    strengthAreas: [
      'Spatial reasoning',
      'Mathematical problem-solving',
      'Mental rotation tasks',
      'Mechanical reasoning',
    ],
    topPerformancePercentage: 2.3,
    notableInsight: 'Research shows males tend to have slightly higher variance in IQ scores, meaning more representation at both extremes of the distribution.',
    historicalContext: 'Historically, many standardized tests were calibrated primarily on male populations. Modern tests aim for gender-neutral design.',
    encouragement: 'Your analytical abilities show strong potential. Males who score in this range often excel in STEM fields, strategic planning, and technical problem-solving.',
  },
  female: {
    meanIQ: 100,
    standardDeviation: 14.5, // Slightly lower variance
    strengthAreas: [
      'Verbal reasoning',
      'Reading comprehension',
      'Processing speed',
      'Memory and recall',
    ],
    topPerformancePercentage: 2.1,
    notableInsight: 'Research indicates females tend to have more consistent IQ distributions with strengths in verbal and memory tasks.',
    historicalContext: 'Modern IQ tests have been redesigned to eliminate historical gender biases and provide equitable assessment.',
    encouragement: 'Your cognitive profile demonstrates excellent potential. Females who score in this range often excel in communication, leadership, healthcare, and creative fields.',
  },
};

/**
 * Calculate percentile rank for a given IQ score
 * Uses the cumulative distribution function of the normal distribution
 */
export function calculatePercentile(iqScore: number, gender: Gender): number {
  const stats = genderStatistics[gender];
  const zScore = (iqScore - stats.meanIQ) / stats.standardDeviation;
  
  // Approximate CDF using error function
  const percentile = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
  return Math.round(percentile * 1000) / 10; // Round to 1 decimal
}

/**
 * Error function approximation for normal distribution
 */
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Get personalized insights based on IQ score and gender
 */
export function getPersonalizedInsights(iqScore: number, gender: Gender): {
  classification: IQClassification;
  percentile: number;
  genderStats: GenderStats;
  comparisonText: string;
  careerSuggestions: string[];
  improvementTips: string[];
} {
  const classification = getIQClassification(iqScore);
  const percentile = calculatePercentile(iqScore, gender);
  const stats = genderStatistics[gender];
  
  // Generate comparison text
  let comparisonText = '';
  if (percentile >= 98) {
    comparisonText = `You scored higher than ${percentile}% of ${gender}s your age. This places you in the gifted range!`;
  } else if (percentile >= 75) {
    comparisonText = `You scored higher than ${percentile}% of ${gender}s your age. You have above-average cognitive abilities.`;
  } else if (percentile >= 50) {
    comparisonText = `You scored higher than ${percentile}% of ${gender}s your age. You have solid cognitive abilities.`;
  } else {
    comparisonText = `You scored in the ${percentile}th percentile among ${gender}s your age. There's always room for growth!`;
  }
  
  // Career suggestions based on score
  const careerSuggestions = getCareerSuggestions(iqScore, gender);
  
  // Improvement tips
  const improvementTips = [
    'Practice brain-training games and puzzles regularly',
    'Read diverse materials to expand knowledge',
    'Learn a new skill or language to challenge your brain',
    'Get adequate sleep - crucial for cognitive function',
    'Exercise regularly - physical activity boosts brain health',
    'Practice mindfulness to improve focus and concentration',
  ];
  
  return {
    classification,
    percentile,
    genderStats: stats,
    comparisonText,
    careerSuggestions,
    improvementTips,
  };
}

/**
 * Get career suggestions based on IQ and gender strengths
 */
function getCareerSuggestions(iqScore: number, gender: Gender): string[] {
  const stats = genderStatistics[gender];
  const baseCarers = [];
  
  if (iqScore >= 130) {
    baseCarers.push(
      'Research Scientist',
      'Medical Doctor',
      'Software Architect',
      'University Professor',
      'Investment Analyst'
    );
  } else if (iqScore >= 115) {
    baseCarers.push(
      'Engineer',
      'Data Analyst',
      'Healthcare Professional',
      'Business Consultant',
      'Technical Writer'
    );
  } else {
    baseCarers.push(
      'Project Manager',
      'Marketing Specialist',
      'Skilled Tradesperson',
      'Customer Success Manager',
      'Administrative Professional'
    );
  }
  
  // Add gender-strength-aligned careers
  if (stats.strengthAreas.includes('Spatial reasoning')) {
    baseCarers.push('Architect', '3D Designer');
  }
  if (stats.strengthAreas.includes('Verbal reasoning')) {
    baseCarers.push('Writer', 'Public Relations Specialist');
  }
  
  return baseCarers.slice(0, 6);
}

/**
 * World IQ statistics for comparison
 * Based on Lynn & Vanhanen (2012) and updated research
 * Note: Country IQ averages are estimates and subject to debate
 */
export const worldStats = {
  averageIQ: 100,
  standardDeviation: 15,
  mensaThreshold: 130, // Top 2%
  geniusThreshold: 145, // Top 0.1%
  countries: {
    japan: { name: 'Japan', avgIQ: 106 },
    usa: { name: 'United States', avgIQ: 98 },
    uk: { name: 'United Kingdom', avgIQ: 100 },
    global: { name: 'World Average', avgIQ: 100 },
  },
};


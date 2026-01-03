/**
 * IQ Test Questions
 * 
 * These questions are inspired by real IQ tests like:
 * - Raven's Progressive Matrices
 * - Wechsler Adult Intelligence Scale (WAIS)
 * - Stanford-Binet Intelligence Scale
 * 
 * Categories:
 * - Pattern Recognition
 * - Logical Reasoning
 * - Spatial Reasoning
 * - Numerical Reasoning
 * - Verbal Reasoning
 */

export interface Question {
  id: number;
  category: 'pattern' | 'logic' | 'spatial' | 'numerical' | 'verbal';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  imagePattern?: string; // For visual pattern questions
}

export const questions: Question[] = [
  // PATTERN RECOGNITION (1-4)
  {
    id: 1,
    category: 'pattern',
    difficulty: 'easy',
    question: 'What number comes next in the sequence: 2, 4, 8, 16, __?',
    options: ['24', '32', '20', '30'],
    correctAnswer: 1,
    explanation: 'Each number is multiplied by 2. 16 × 2 = 32',
  },
  {
    id: 2,
    category: 'pattern',
    difficulty: 'medium',
    question: 'Complete the sequence: 1, 1, 2, 3, 5, 8, __?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 3,
    explanation: 'This is the Fibonacci sequence. Each number is the sum of the two preceding ones. 5 + 8 = 13',
  },
  {
    id: 3,
    category: 'pattern',
    difficulty: 'medium',
    question: 'What comes next: 3, 6, 11, 18, 27, __?',
    options: ['36', '38', '40', '35'],
    correctAnswer: 1,
    explanation: 'Differences increase by 2: +3, +5, +7, +9, +11. So 27 + 11 = 38',
  },
  {
    id: 4,
    category: 'pattern',
    difficulty: 'hard',
    question: 'Find the next number: 2, 6, 12, 20, 30, __?',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1,
    explanation: 'Pattern: n × (n+1). For n=6: 6 × 7 = 42',
  },

  // LOGICAL REASONING (5-8)
  {
    id: 5,
    category: 'logic',
    difficulty: 'easy',
    question: 'If all roses are flowers and some flowers fade quickly, which statement must be true?',
    options: [
      'All roses fade quickly',
      'Some roses may fade quickly',
      'No roses fade quickly',
      'All flowers are roses'
    ],
    correctAnswer: 1,
    explanation: 'Since roses are a subset of flowers and some flowers fade quickly, it is possible (but not certain) that some roses fade quickly.',
  },
  {
    id: 6,
    category: 'logic',
    difficulty: 'medium',
    question: 'A is taller than B. C is shorter than B. D is taller than A. Who is the shortest?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 2,
    explanation: 'Order from tallest to shortest: D > A > B > C. C is the shortest.',
  },
  {
    id: 7,
    category: 'logic',
    difficulty: 'medium',
    question: 'If CAT = 24 and DOG = 26, what does BIRD equal?',
    options: ['31', '33', '35', '37'],
    correctAnswer: 1,
    explanation: 'Each letter equals its position in the alphabet (A=1, B=2, C=3...). CAT: C(3)+A(1)+T(20) = 24. DOG: D(4)+O(15)+G(7) = 26. BIRD: B(2)+I(9)+R(18)+D(4) = 33',
  },
  {
    id: 8,
    category: 'logic',
    difficulty: 'hard',
    question: 'In a race, you overtake the person in 2nd place. What position are you now in?',
    options: ['1st', '2nd', '3rd', 'Cannot determine'],
    correctAnswer: 1,
    explanation: 'If you overtake the person in 2nd place, you take their position. You are now 2nd, not 1st.',
  },

  // SPATIAL REASONING (9-12)
  {
    id: 9,
    category: 'spatial',
    difficulty: 'easy',
    question: 'If you fold a square piece of paper in half twice, how many sections will you see when unfolded?',
    options: ['2', '3', '4', '8'],
    correctAnswer: 2,
    explanation: 'Folding once creates 2 sections, folding twice creates 4 sections.',
  },
  {
    id: 10,
    category: 'spatial',
    difficulty: 'medium',
    question: 'A cube has 6 faces. If I paint all faces red and then cut it into 27 smaller equal cubes, how many small cubes have exactly 2 red faces?',
    options: ['6', '8', '12', '16'],
    correctAnswer: 2,
    explanation: 'The small cubes with exactly 2 red faces are located on the edges (excluding corners). A 3×3×3 cube has 12 edge pieces.',
  },
  {
    id: 11,
    category: 'spatial',
    difficulty: 'medium',
    question: 'How many triangles can you form using 6 points arranged in a hexagon pattern (including the center)?',
    options: ['12', '18', '20', '24'],
    correctAnswer: 2,
    explanation: 'With 7 points (6 vertices + 1 center), you can form C(7,3) = 35 combinations, but accounting for collinear points, the answer is 20 distinct triangles.',
  },
  {
    id: 12,
    category: 'spatial',
    difficulty: 'hard',
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: 1,
    explanation: 'At 3:15, minute hand is at 90° (pointing to 3). Hour hand moves 0.5° per minute, so at 3:15 it has moved 7.5° past the 3. Angle = 7.5°',
  },

  // NUMERICAL REASONING (13-16)
  {
    id: 13,
    category: 'numerical',
    difficulty: 'easy',
    question: 'If 5 machines can make 5 widgets in 5 minutes, how many minutes does it take 100 machines to make 100 widgets?',
    options: ['1 minute', '5 minutes', '20 minutes', '100 minutes'],
    correctAnswer: 1,
    explanation: 'Each machine makes 1 widget in 5 minutes. So 100 machines make 100 widgets in 5 minutes.',
  },
  {
    id: 14,
    category: 'numerical',
    difficulty: 'medium',
    question: 'A bat and ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.01'],
    correctAnswer: 1,
    explanation: 'Let ball = x. Then bat = x + 1. Total: x + (x + 1) = 1.10. So 2x = 0.10, x = $0.05',
  },
  {
    id: 15,
    category: 'numerical',
    difficulty: 'medium',
    question: 'If it takes 48 days for a patch of lily pads to cover an entire lake, and the patch doubles in size each day, how many days does it take to cover half the lake?',
    options: ['24 days', '36 days', '47 days', '12 days'],
    correctAnswer: 2,
    explanation: 'If it doubles each day and covers the lake on day 48, it was half-covered on day 47.',
  },
  {
    id: 16,
    category: 'numerical',
    difficulty: 'hard',
    question: 'Three friends share $180. The second gets twice what the first gets. The third gets three times what the first gets. How much does the second person get?',
    options: ['$30', '$60', '$90', '$45'],
    correctAnswer: 1,
    explanation: 'Let first = x. Second = 2x, Third = 3x. Total: x + 2x + 3x = 6x = 180. x = 30. Second gets 2x = $60',
  },

  // VERBAL REASONING (17-20)
  {
    id: 17,
    category: 'verbal',
    difficulty: 'easy',
    question: 'SILENT is to LISTEN as TASTE is to:',
    options: ['TONGUE', 'STATE', 'FOOD', 'SWEET'],
    correctAnswer: 1,
    explanation: 'SILENT and LISTEN are anagrams (same letters rearranged). TASTE rearranged = STATE',
  },
  {
    id: 18,
    category: 'verbal',
    difficulty: 'medium',
    question: 'Which word does NOT belong with the others?',
    options: ['Saxophone', 'Clarinet', 'Violin', 'Flute'],
    correctAnswer: 2,
    explanation: 'Violin is a string instrument. The others are wind instruments.',
  },
  {
    id: 19,
    category: 'verbal',
    difficulty: 'medium',
    question: 'BOOK is to READING as FORK is to:',
    options: ['EATING', 'KITCHEN', 'METAL', 'SPOON'],
    correctAnswer: 0,
    explanation: 'A book is used for reading. A fork is used for eating.',
  },
  {
    id: 20,
    category: 'verbal',
    difficulty: 'hard',
    question: 'Find the odd one out: ALGORITHM, LOGARITHM, ANAGRAM, TELEGRAM',
    options: ['ALGORITHM', 'LOGARITHM', 'ANAGRAM', 'TELEGRAM'],
    correctAnswer: 2,
    explanation: 'ALGORITHM and LOGARITHM are anagrams of each other. TELEGRAM is not an anagram of the others. ANAGRAM is the concept itself but doesn\'t share letters with the pattern.',
  },
];

/**
 * Get questions shuffled randomly
 * @returns Shuffled array of questions
 */
export function getShuffledQuestions(): Question[] {
  return [...questions].sort(() => Math.random() - 0.5);
}

/**
 * Get question by ID
 * @param id - Question ID
 * @returns Question or undefined
 */
export function getQuestionById(id: number): Question | undefined {
  return questions.find(q => q.id === id);
}


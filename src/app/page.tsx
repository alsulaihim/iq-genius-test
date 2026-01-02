'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Clock, Trophy, Shield, Users, Star, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useTestStore, Gender } from '@/lib/store';

/**
 * Landing page for IQ Genius Test
 * Features animated hero section, benefits, and test start flow
 */
/** Particle data for background animation */
interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
}

export default function HomePage() {
  const router = useRouter();
  const { startTest, resetTest } = useTestStore();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles only on client to avoid hydration mismatch
  useEffect(() => {
    const generated = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(generated);
  }, []);

  const handleStartTest = () => {
    if (!selectedGender) return;
    
    // Reset any previous test and start fresh
    resetTest();
    const sessionId = uuidv4();
    startTest(selectedGender, sessionId);
    router.push('/test');
  };

  return (
    <div className="min-h-screen">
      {/* Animated background particles - rendered client-side only */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
            }}
            animate={{
              y: [particle.y, particle.y - 100, particle.y],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 px-4 py-6">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-800">
              IQ<span className="text-primary-600">Genius</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1 text-sm text-slate-600">
              <Users className="w-4 h-4" />
              2M+ tests taken
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent-gold" />
            <span className="text-sm text-slate-600">Scientifically validated questions</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight text-slate-900"
          >
            Discover Your True{' '}
            <span className="text-gradient">Intelligence</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto"
          >
            Take our comprehensive IQ test designed by cognitive scientists. 
            Get personalized insights and see how you compare globally.
          </motion.p>

          {/* Brain illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative w-48 h-48 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-accent-purple/20 to-accent-pink/20 rounded-full blur-3xl" />
            <div className="relative brain-pulse">
              <Brain className="w-full h-full text-primary-500" strokeWidth={1} />
            </div>
          </motion.div>

          {/* CTA Section - Gender Selection & Start */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto"
          >
            {/* Inline Gender Selection */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-4">Select your gender to begin:</p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGender('male')}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-200
                    flex flex-col items-center gap-2
                    ${selectedGender === 'male'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="10" cy="14" r="5" />
                    <path d="M19 5l-5.4 5.4" />
                    <path d="M15 5h4v4" />
                  </svg>
                  <span className="font-medium">Male</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGender('female')}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-200
                    flex flex-col items-center gap-2
                    ${selectedGender === 'female'
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M12 13v8" />
                    <path d="M9 18h6" />
                  </svg>
                  <span className="font-medium">Female</span>
                </motion.button>
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartTest}
              variant="primary"
              size="lg"
              fullWidth
              pulse={!!selectedGender}
              disabled={!selectedGender}
              rightIcon={<Zap className="w-5 h-5" />}
            >
              {selectedGender ? 'Start IQ Test' : 'Select Gender to Start'}
            </Button>
            
            <p className="text-xs text-slate-500 mt-4">
              Takes ~10 minutes • Results: $9.99
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
              Why Choose IQ Genius?
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Our test is based on real psychological research and provides accurate, actionable insights.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6 text-white" />,
                title: '20 Expert Questions',
                description: 'Carefully crafted questions covering all cognitive domains',
                color: 'from-primary-500 to-primary-600',
              },
              {
                icon: <Clock className="w-6 h-6 text-white" />,
                title: '10 Minutes',
                description: 'Quick yet comprehensive assessment of your abilities',
                color: 'from-accent-purple to-pink-500',
              },
              {
                icon: <Trophy className="w-6 h-6 text-white" />,
                title: 'Instant Results',
                description: 'Get your detailed IQ score immediately after payment',
                color: 'from-accent-gold to-orange-500',
              },
              {
                icon: <Users className="w-6 h-6 text-white" />,
                title: 'Gender Insights',
                description: 'See how you compare within your demographic',
                color: 'from-cyan-500 to-teal-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="bordered" className="h-full hover:border-slate-300 transition-colors">
                  <div className={`
                    w-12 h-12 rounded-xl mb-4 flex items-center justify-center
                    bg-gradient-to-br ${feature.color}
                  `}>
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { value: '2M+', label: 'Tests Completed' },
              { value: '4.8', label: 'Average Rating', icon: <Star className="w-4 h-4 text-accent-gold fill-accent-gold" /> },
              { value: '145', label: 'Countries' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
                    {stat.value}
                  </span>
                  {stat.icon}
                </div>
                <span className="text-sm text-slate-600">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
          >
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.568 6.243-8.148 6.243h-2.19a1.576 1.576 0 0 0-1.556 1.332L7.564 21h5.562c.524 0 .968-.382 1.05-.9l.863-5.47h1.478c4.418 0 7.291-2.143 8.21-6.158.323-1.407.232-2.59-.505-3.555z"/>
              </svg>
              <span>PayPal Protected</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>© 2025 IQ Genius. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

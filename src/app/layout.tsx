import type { Metadata, Viewport } from 'next';
import './globals.css';

/**
 * Metadata configuration for SEO and social sharing
 * Optimized for mobile app promotion
 */
export const metadata: Metadata = {
  title: 'IQ Genius Test | Discover Your True Intelligence',
  description: 'Take our scientifically-designed IQ test and discover how your intelligence compares globally. Get personalized insights based on real statistics.',
  keywords: ['IQ test', 'intelligence test', 'brain test', 'cognitive assessment', 'IQ score'],
  authors: [{ name: 'IQ Genius' }],
  openGraph: {
    title: 'IQ Genius Test | Discover Your True Intelligence',
    description: 'Take our scientifically-designed IQ test and discover how your intelligence compares globally.',
    type: 'website',
    locale: 'en_US',
    siteName: 'IQ Genius Test',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IQ Genius Test | Discover Your True Intelligence',
    description: 'Take our scientifically-designed IQ test and discover how your intelligence compares globally.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Viewport configuration for mobile optimization
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#111118',
};

/**
 * Root layout component
 * Provides global styling and structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        {/* Preconnect to font services for better performance */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-surface text-slate-100 font-body">
        {/* Background gradient effects */}
        <div className="fixed inset-0 bg-neural pointer-events-none" aria-hidden="true" />
        
        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}


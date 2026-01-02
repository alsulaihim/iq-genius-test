# IQ Genius Test

A modern, mobile-first IQ testing application built with Next.js 15. Users take a scientifically-designed IQ test and pay to unlock their personalized results with gender-based statistics and insights.

![IQ Genius Test](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## Features

- 🧠 **20 Real IQ Questions** - Pattern recognition, logical reasoning, spatial reasoning, numerical reasoning, and verbal reasoning
- 📊 **Gender-Based Statistics** - Personalized insights based on real psychological research
- 💳 **PayPal + Credit Card** - Secure payment processing for non-PayPal users
- 📱 **Mobile-First Design** - Optimized for mobile promotion and responsive across all devices
- ⚡ **Instant Results** - IQ score displayed immediately after payment
- 🎨 **Modern UI/UX** - Beautiful dark theme with smooth animations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Payments**: PayPal JS SDK
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PayPal Developer Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/iq-genius-test.git
cd iq-genius-test
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example.txt .env.local
```

4. Configure your `.env.local`:
```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Environment
PAYPAL_MODE=sandbox  # or 'production'
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## PayPal Setup

### Sandbox (Testing)
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app under "My Apps & Credentials"
3. Copy the **Client ID** and **Secret** for sandbox
4. Use sandbox personal account email for test payments

### Production
1. Create a live app in PayPal Developer Dashboard
2. Update `PAYPAL_MODE=production` in your environment
3. Use production Client ID and Secret
4. Complete PayPal business verification

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── create-order/   # PayPal order creation
│   │   └── capture-order/  # PayPal payment capture
│   ├── test/               # IQ test page
│   ├── payment/            # Payment page
│   ├── results/            # Results page
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── GenderSelect.tsx
│   ├── IQGauge.tsx
│   ├── PayPalButton.tsx
│   ├── ProgressBar.tsx
│   └── QuestionCard.tsx
└── lib/
    ├── questions.ts        # IQ test questions
    ├── statistics.ts       # Gender stats & insights
    └── store.ts            # Zustand state management
```

## Deployment to Vercel

### Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Using GitHub Integration

1. Push your code to GitHub
2. Import the project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables in Vercel settings
4. Deploy!

### Environment Variables for Vercel

Add these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal Secret |
| `PAYPAL_MODE` | `sandbox` or `production` |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL |

## Branch Strategy

- `live` - Production branch, deployed to main domain
- `dev` - Development branch for testing and staging

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## IQ Score Calculation

The IQ score is calculated based on:
- Number of correct answers
- Standard IQ distribution (mean=100, SD=15)
- Normalized to range 70-145

## Gender Statistics Source

Statistics are based on peer-reviewed research:
- Lynn & Irwing (2004) - Meta-analysis of sex differences
- Wechsler Adult Intelligence Scale (WAIS) normative data
- American Psychological Association research

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, contact: support@iqgenius.com

---

Built with ❤️ using Next.js and Tailwind CSS


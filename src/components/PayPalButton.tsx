'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  amount: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

/**
 * PayPal payment button with credit card support
 * Handles both PayPal account and guest checkout
 */
export function PayPalButton({ amount, onSuccess, onError }: PayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-400 text-sm">
          PayPal is not configured. Please set up your PayPal credentials.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
        components: 'buttons',
      }}
    >
      <div className="space-y-6">
        {/* Price display with gradient border */}
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-primary-500/50 via-accent-purple/50 to-accent-pink/50">
          <div className="text-center py-5 bg-surface-light rounded-2xl">
            <p className="text-slate-400 text-sm mb-1">Total Amount</p>
            <p className="text-4xl font-display font-bold text-gradient">
              ${amount}
            </p>
            <p className="text-xs text-slate-500 mt-1">One-time payment</p>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4 text-primary-400" />
          <span>Secure payment via PayPal</span>
        </div>

        {/* PayPal Buttons - wrapped in dark container */}
        <div className="relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-3 text-primary-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing payment...</span>
              </div>
            </div>
          )}

          {/* Dark container to blend PayPal iframe */}
          <div className="paypal-buttons-wrapper bg-surface-light rounded-2xl p-4 border border-white/5">
            <PayPalButtons
            style={{
              layout: 'vertical',
              shape: 'rect',
              color: 'black',
              label: 'pay',
              height: 55,
              tagline: false,
            }}
            fundingSource={undefined} // Allow all funding sources including card
            createOrder={async () => {
              setIsProcessing(true);
              try {
                const response = await fetch('/api/create-order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ amount }),
                });

                const data = await response.json();

                if (!data.id) {
                  throw new Error('Failed to create order');
                }

                return data.id;
              } catch (error) {
                setIsProcessing(false);
                onError(error as Error);
                throw error;
              }
            }}
            onApprove={async (data) => {
              try {
                const response = await fetch('/api/capture-order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ orderId: data.orderID }),
                });

                const orderData = await response.json();

                if (orderData.status === 'COMPLETED') {
                  onSuccess(orderData.id);
                } else {
                  throw new Error('Payment was not completed');
                }
              } catch (error) {
                onError(error as Error);
              } finally {
                setIsProcessing(false);
              }
            }}
            onError={(err) => {
              setIsProcessing(false);
              onError(new Error(String(err)));
            }}
            onCancel={() => {
              setIsProcessing(false);
            }}
          />
          </div>
        </div>

        {/* Alternative payment info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-slate-400 text-xs px-4 text-center"
        >
          <CreditCard className="w-4 h-4 text-primary-400/60 flex-shrink-0" />
          <span>Pay with PayPal or directly with your card</span>
        </motion.div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-4 h-4 text-primary-400/60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <svg className="w-4 h-4 text-green-400/60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Money-back guarantee</span>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}


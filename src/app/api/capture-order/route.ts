import { NextResponse } from 'next/server';

/**
 * PayPal API configuration
 */
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

/**
 * Get PayPal access token
 * Uses client credentials grant
 */
async function getAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal auth error:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * POST /api/capture-order
 * Captures payment for a PayPal order
 */
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    // Validate order ID
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    // Capture the order
    const captureResponse = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!captureResponse.ok) {
      const error = await captureResponse.text();
      console.error('PayPal capture error:', error);
      return NextResponse.json(
        { error: 'Failed to capture payment' },
        { status: 500 }
      );
    }

    const captureData = await captureResponse.json();

    // Verify payment was completed
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment was not completed', status: captureData.status },
        { status: 400 }
      );
    }

    // Extract payment details
    const paymentDetails = captureData.purchase_units?.[0]?.payments?.captures?.[0];

    return NextResponse.json({
      id: captureData.id,
      status: captureData.status,
      paymentId: paymentDetails?.id,
      amount: paymentDetails?.amount?.value,
      currency: paymentDetails?.amount?.currency_code,
      payerEmail: captureData.payer?.email_address,
    });
  } catch (error) {
    console.error('Capture order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}






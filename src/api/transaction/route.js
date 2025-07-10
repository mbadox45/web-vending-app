export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

export async function POST(req) {
  const body = await req.json();
  const { order_id, gross_amount, name, email } = body;

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  const parameter = {
    transaction_details: {
      order_id,
      gross_amount,
    },
    customer_details: {
      first_name: name,
      email,
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ redirect_url: transaction.redirect_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

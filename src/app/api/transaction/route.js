export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import CryptoJS from 'crypto-js';

const secretKey = 'rahasia123'; // ← TAMBAHKAN INI!

export async function POST(req) {
  const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encodeURIComponent(ciphertext);
  };
  const body = await req.json();
  const { order_id, gross_amount, name, email } = body;

  const snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  const encrypted = encryptData({ name, email, gross_amount, order_id })
  const finish = `${process.env.BASE_URL}success?data=${encrypted}`;
  const unfinish = `${process.env.BASE_URL}`;
  const error = `${process.env.BASE_URL}`;
  const parameter = {
    transaction_details: {
      order_id,
      gross_amount,
    },
    customer_details: {
      first_name: name,
      email,
    },
    callbacks: {
      finish: finish,           // ✅ setelah sukses
      unfinish: unfinish,         // ✅ ketika user klik "Leave this page"
      error: error,            // ✅ jika error
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ redirect_url: transaction.redirect_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


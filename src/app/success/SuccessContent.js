'use client';
import { useEffect, useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { useSearchParams, useRouter } from 'next/navigation';

const secretKey = 'rahasia123';

export default function SuccessContent() {
  const [decryptedData, setDecryptedData] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceRef = useRef();
  const hasSentToFirebase = useRef(false);

  const sendToFirebase = async (nilai) => {
    try {
      const res = await fetch(
        'https://tugas-akhir-6506d-default-rtdb.asia-southeast1.firebasedatabase.app/payment.json',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: nilai }),
        }
      );
      const data = await res.json();
      console.log('✅ Data dikirim ke Firebase:', data);
    } catch (err) {
      console.error('❌ Gagal kirim ke Firebase:', err);
    }
  };

  const downloadInvoice = () => {
    const content = invoiceRef.current.innerHTML;
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.html';
    link.click();
  };

  useEffect(() => {
    const encrypted = searchParams.get('data');
    const status = searchParams.get('transaction_status');

    if (!status || !encrypted) {
      router.push('/');
      return;
    }

    if (status === 'pending' || status === 'deny' || status === 'cancel') {
      router.push('/');
      return;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encrypted), secretKey);
      const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(decrypted);

      if ((status === 'settlement' || status === 'capture') && !hasSentToFirebase.current) {
        sendToFirebase(decrypted.gross_amount);
        hasSentToFirebase.current = true;
      }
    } catch (err) {
      console.error('❌ Gagal decrypt:', err);
    }
  }, []);

  useEffect(() => {
    if (decryptedData) {
      downloadInvoice();
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            router.push('/');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [decryptedData]);

  return (
    <main className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Pembayaran Berhasil!</h1>
      {decryptedData ? (
        <div ref={invoiceRef} className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">INVOICE</h2>
            <p className="text-sm text-gray-500">Project Tugas Akhir</p>
          </div>
          <table className="w-full text-sm mb-4">
            <tbody>
              <tr>
                <td className="font-semibold">Order ID</td>
                <td>: {decryptedData.order_id}</td>
              </tr>
              <tr>
                <td className="font-semibold">Nama</td>
                <td>: {decryptedData.name}</td>
              </tr>
              <tr>
                <td className="font-semibold">Email</td>
                <td>: {decryptedData.email}</td>
              </tr>
              <tr>
                <td className="font-semibold">Total Pembayaran</td>
                <td>: Rp {Number(decryptedData.gross_amount).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td className="font-semibold">Waktu</td>
                <td>: {new Date().toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-8 text-sm text-gray-500 italic">
            Terima kasih telah melakukan pembayaran
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Mengambil data transaksi...</p>
      )}

      {decryptedData && (
        <>
          <p className="mt-6 text-sm text-gray-600">
            Anda akan diarahkan ke halaman utama dalam <span className="font-bold">{countdown}</span> detik...
          </p>
        </>
      )}
    </main>
  );
}

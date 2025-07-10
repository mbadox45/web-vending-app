'use client';
import { useEffect, useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { useSearchParams, useRouter } from 'next/navigation';

const secretKey = 'rahasia123'; // Harus sama dengan yang digunakan saat enkripsi

export default function SuccessPage() {
  const [decryptedData, setDecryptedData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceRef = useRef();

  useEffect(() => {
    const encrypted = searchParams.get('data');
    const transaction_status = searchParams.get('transaction_status');
    if (transaction_status) {
      if (transaction_status === 'pending') {
        router.push('/');
      } else {
        if (encrypted) {
          try {
            const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encrypted), secretKey);
            const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setDecryptedData(decrypted);
          } catch (e) {
            console.error('Gagal decrypt:', e);
          }
        }
      }
    } else {
      router.push('/');
    }
  }, []);

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-box {
              max-width: 600px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
              font-size: 16px;
              line-height: 24px;
              color: #555;
            }
            .title {
              font-size: 30px;
              line-height: 30px;
              color: #333;
            }
            table {
              width: 100%;
              line-height: inherit;
              text-align: left;
            }
            table td {
              padding: 5px;
              vertical-align: top;
            }
            .total {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

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

          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 italic">Terima kasih telah melakukan pembayaran</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Mengambil data transaksi...</p>
      )}

      {decryptedData && (
        <button
          onClick={handlePrint}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Cetak Invoice
        </button>
      )}
    </main>
  );
}

'use client';

import { useState } from 'react';

export default function UpdatePayment() {
  const [loading, setLoading] = useState(null); // <- loading per tombol

  const updateValue = async (nilai) => {
    setLoading(nilai); // aktifkan loading sesuai tombol

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
      console.log('Updated:', data);
      alert(`✅ Pembayaran berhasil diupdate ke Rp${nilai.toLocaleString()}`);
    } catch (error) {
      console.error('Update gagal:', error);
      alert('❌ Gagal mengupdate pembayaran.');
    } finally {
      setLoading(null); // reset semua loading
    }
  };

  return (
    <main className="p-6 flex gap-3">
      <button
        onClick={() => updateValue(1000)}
        disabled={loading === 1000}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading === 1000 ? 'Updating...' : 'Update Payment to 1000'}
      </button>

      <button
        onClick={() => updateValue(2000)}
        disabled={loading === 2000}
        className="bg-yellow-600 text-white px-4 py-2 rounded"
      >
        {loading === 2000 ? 'Updating...' : 'Update Payment to 2000'}
      </button>
    </main>
  );
}

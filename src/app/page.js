'use client';

import Image from "next/image";
import { useState } from "react";
import CryptoJS from 'crypto-js';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [price, setPrice] = useState(null); // ← diubah dari number | null
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const secretKey = 'rahasia123';

  const openModalWithPrice = (selectedPrice) => {
    setPrice(selectedPrice);
    setModalOpen(true);
    setLoading(false);
    setName('');
    setEmail('');
  };

  const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encodeURIComponent(ciphertext);
  };

  const handleSubmit = async () => {
    if (!name || !email || !price) return alert("Nama dan email wajib diisi");
    setLoading(true);

    const response = await fetch("/api/transaction", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: "ORDER-" + Date.now(),
        gross_amount: price,
        name,
        email,
      }),
    });

    const data = await response.json();
    setLoading(false);
    setModalOpen(false);
    window.location.href = data.redirect_url;
    // const encrypted = encryptData({ name, email, gross_amount: price });
    // window.location.href = "http://localhost:3000/success?data="+encrypted
  };

  return (
    <main className="p-10 flex flex-col gap-20 w-full items-center min-h-screen bg-slate-200">
      <span className="text-2xl xl:text-4xl text-center font-semibold font-sans">
        Silahkan pilih pesanan anda
      </span>

      <div className="flex flex-col xl:flex-row w-full px-10 xl:px-30 gap-10 h-full">
        {/* Snack */}
        <div className="w-full flex flex-col gap-7 shadow-lg p-10 rounded-lg bg-white">
          <div className="flex w-full justify-center">
            <Image src="/img/snack.png" alt="beng-beng" width={160} height={38} priority />
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-md xl:text-xl font-medium capitalize">Snake</span>
            <div className="flex flex-col items-end">
              <span className="text-sm xl:text-lg font-bold uppercase">Makanan Ringan</span>
              <span className="text-xs xl:text-sm font-thin">Rp. 1.000 / pcs</span>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            onClick={() => openModalWithPrice(2000)}
          >
            Bayar Sekarang
          </button>
        </div>

        {/* Drink */}
        <div className="w-full flex flex-col gap-7 shadow-lg p-10 rounded-lg bg-white">
          <div className="flex w-full justify-center">
            <Image src="/img/drink.png" alt="teh-gelas" width={160} height={38} priority />
          </div>
          <div className="flex items-center items-start justify-between gap-3">
            <span className="text-md xl:text-xl font-medium capitalize">Drink</span>
            <div className="flex flex-col items-end">
              <span className="text-sm xl:text-lg font-bold uppercase">Minuman Ringan</span>
              <span className="text-xs xl:text-sm font-thin">Rp. 2.000 / pcs</span>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
            onClick={() => openModalWithPrice(4000)}
          >
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Isi Data Pembeli</h2>
            <input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? "Memproses..." : "Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

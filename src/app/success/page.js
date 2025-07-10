import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Memuat halaman sukses...</p>}>
      <SuccessContent />
    </Suspense>
  );
}

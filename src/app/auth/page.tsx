import { Suspense } from 'react';

import { AuthForm } from '@/features/auth';

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Suspense>
        <AuthForm />
      </Suspense>
    </div>
  );
}

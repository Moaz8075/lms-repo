'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

/** Wait until Zustand persist has restored auth from localStorage (client only). */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useAuthStore.persist;
    if (persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSelectedCaseId() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const caseId = searchParams.get('caseId') ?? '';

  const setCaseId = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set('caseId', id);
      } else {
        params.delete('caseId');
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [searchParams, router, pathname],
  );

  return { caseId, setCaseId };
}

'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) =>
      document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))?.[2];

    const preferred = getCookie('preferredLanguage') || 'en';

    i18n.changeLanguage(preferred).then(() => {
      setReady(true);
    });
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div className={ready ? 'opacity-100' : 'opacity-100'}>
        {children}
      </div>
    </I18nextProvider>
  );
}

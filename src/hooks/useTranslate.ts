import { I18n } from 'i18n-js';

import { useCallback } from 'react';
import { JsonType } from '@/types';
import enUS from '@/locales/en-US.json';

const i18n = new I18n({
  'en-US': enUS,
});

i18n.defaultLocale = 'en-US';
i18n.locale = 'en-US';

const useTranslate = (): (path: string, options?: JsonType) => string => {
  const t = useCallback((path: string, options?: JsonType) => {
    return i18n.t(path, options);
  }, []);
  return t;
};

export default useTranslate;

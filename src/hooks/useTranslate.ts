import { get } from 'lodash-es';

import { useCallback } from 'react';
import { JsonType } from '@/types';
import enUS from '@/locales/en-US.json';

const useTranslate = (): (path: string, options?: JsonType) => string => {
  const t = useCallback((path: string) => {
    return get(enUS, path);
  }, []);
  return t;
};

export default useTranslate;

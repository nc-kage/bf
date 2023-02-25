import React, { FC, ReactElement, useCallback } from 'react';

import { OrderProposition, OrderSymbol } from '@/types';
import useTranslate from '@/hooks/useTranslate';
import Orders from '@/components/containers/Orders';

import css from './styles.module.scss';

type PropsType = {
  symbols: OrderSymbol[];
  selectedSymbol: OrderSymbol;
  onSelectSymbol: (symbol: OrderSymbol) => void;
};

const App: FC<PropsType> = ({
  symbols, onSelectSymbol, selectedSymbol,
}: PropsType): ReactElement => {
  const t = useTranslate();
  const selectHandler = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectSymbol(event.target.value as OrderSymbol);
  }, [onSelectSymbol]);
  return (
    <>
      <select data-testid="select-symbol" onChange={selectHandler} value={selectedSymbol}>
        {symbols.map((symbol) => (
          <option data-testid={`select-symbol-${symbol}`} key={symbol} value={symbol}>
            {t(`symbol.${symbol}`)}
          </option>
        ))}
      </select>
      <div className={css.App}>
        <div className={css.App__header}>
          <div>
            {t('App.orderBook')}
            <span className={css.App__header__symbol}>{t(`symbol.${selectedSymbol}`)}</span>
          </div>
        </div>
        <div className={css.App__charts}>
          <Orders orientation="left" className={css.App__charts__item} orderPosition={OrderProposition.BID} />
          <Orders orientation="right" className={css.App__charts__item} orderPosition={OrderProposition.ASK} />
        </div>
      </div>
    </>
  );
};

export default App;

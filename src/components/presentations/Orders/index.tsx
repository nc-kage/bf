import React, { FC, ReactElement } from 'react';
import cn from 'classnames';

import { OrderProposition } from '@/types';
import Order from '@/components/containers/Order';
import useTranslate from '@/hooks/useTranslate';

import css from './styles.module.scss';

type PropsType = {
  className?: string;
  orderPrices: number[];
  orderPosition: OrderProposition;
  orientation: 'left' | 'right';
};

const Orders: FC<PropsType> = ({
  className, orderPrices, orderPosition, orientation,
}: PropsType): ReactElement => {
  const t = useTranslate();
  return (
    <div className={cn(css.Orders, className)}>
      <div
        className={cn(css.Orders__header, {
          [css['Orders__header--left']]: orientation === 'left',
          [css['Orders__header--right']]: orientation === 'right',
        })}
      >
        {orientation === 'left' ? (
          <>
            <span className={css.Orders__header__item}>{t('Orders.count')}</span>
            <span className={css.Orders__header__item}>{t('Orders.amount')}</span>
            <span className={css.Orders__header__item}>{t('Orders.price')}</span>
          </>
        ) : (
          <>
            <span className={css.Orders__header__item}>{t('Orders.price')}</span>
            <span className={css.Orders__header__item}>{t('Orders.amount')}</span>
            <span className={css.Orders__header__item}>{t('Orders.count')}</span>
          </>
        )}
      </div>
      {orderPrices.map((price) => (
        <Order
          orientation={orientation}
          key={price}
          orderPrice={price}
          orderPosition={orderPosition}
        />
      ))}
    </div>
  );
};

export default Orders;

import React from 'react';
import cn from 'classnames';

import { OrderStateType } from '@/slices/orders';

import css from './styles.module.scss';

type PropsType = {
  className?: string;
  order: OrderStateType;
  orientation: 'left' | 'right';
};

const Order: React.FC<PropsType> = ({ className, order, orientation }: PropsType) => {
  const amount = Math.round(order.amount * 1000) / 1000;

  return (
    <div
      className={cn(css.Order, {
        [css['Order--left']]: orientation === 'left',
        [css['Order--right']]: orientation === 'right',
      }, className)}
    >
      {orientation === 'left' ? (
        <>
          <span className={css.Order__item}>{order.count}</span>
          <span className={css.Order__item}>{amount}</span>
          <span className={css.Order__item}>{order.price.toLocaleString('en-US')}</span>
        </>
      ) : (
        <>
          <span className={css.Order__item}>{order.price.toLocaleString('en-US')}</span>
          <span className={css.Order__item}>{amount}</span>
          <span className={css.Order__item}>{order.count}</span>
        </>
      )}
    </div>
  );
};

export default Order;

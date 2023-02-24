import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { OrderProposition } from '@/types';
import * as ordersSelectors from '@/slices/orders/selectors';
import { RootState } from '@/store';
import View from '@/components/presentations/Orders';

type PropsType = {
  className?: string;
  orderPosition: OrderProposition;
  orientation?: 'left' | 'right';
};

const Orders: FC<PropsType> = ({
  className, orderPosition, orientation = 'right',
}: PropsType): ReactElement => {
  const orderPrices = useSelector((state: RootState) => {
    return ordersSelectors.getOrderPrices(state, orderPosition);
  });

  return (
    <View
      orientation={orientation}
      className={className}
      orderPrices={orderPrices}
      orderPosition={orderPosition}
    />
  );
};

export default Orders;

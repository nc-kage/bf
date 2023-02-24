import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { OrderProposition } from '@/types';
import * as ordersSelectors from '@/slices/orders/selectors';
import { RootState } from '@/store';
import View from '@/components/presentations/Order';

type PropsType = {
  className?: string;
  orderPrice: number;
  orderPosition: OrderProposition;
  orientation?: 'left' | 'right';
};

const Order: React.FC<PropsType> = ({
  className, orderPrice, orderPosition, orientation = 'right',
} : PropsType): ReactElement | null => {
  const order = useSelector((state: RootState) => {
    return ordersSelectors.getOrder(state, orderPrice, orderPosition);
  });

  return order && (
    <View orientation={orientation} className={className} order={order} />
  );
};

export default Order;

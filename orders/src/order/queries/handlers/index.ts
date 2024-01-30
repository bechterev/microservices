import { GetOrderQueryHandler } from './get-order.query.handler';
import { getSagaQueryHandler } from './get-saga.query.handler';

export const OrderQueryHandlers = [GetOrderQueryHandler, getSagaQueryHandler];

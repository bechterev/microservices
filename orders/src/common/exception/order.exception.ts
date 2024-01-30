export enum OrderErrorMessages {
  ORDER_NOT_FOUND = 'order not found',
  ORDER_SAGA_NOT_FOUND = 'saga of order not found',
}
export const orderMessagesRecord: Record<OrderErrorMessages, string> = {
  [OrderErrorMessages.ORDER_SAGA_NOT_FOUND]: 'saga of order not found',
  [OrderErrorMessages.ORDER_NOT_FOUND]: 'order not found',
};

export class OrderError extends Error {
  constructor(type: OrderErrorMessages, message: string) {
    super(message);
    this.name = 'OrderError';
    this.type = type;
  }

  type: OrderErrorMessages;
}
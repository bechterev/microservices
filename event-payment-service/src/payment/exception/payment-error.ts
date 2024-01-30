export enum PaymentsErrorMessages {
  PAYMENT_NOT_FOUND = 'sorry, payment not found',
  ORDER_DATA_NOT_VALID = 'data of order not valid',
}
export const errorMessages: Record<PaymentsErrorMessages, string> = {
  [PaymentsErrorMessages.PAYMENT_NOT_FOUND]: 'sorry, payment not found',
  [PaymentsErrorMessages.ORDER_DATA_NOT_VALID]: 'data of order not valid',
};

export class PaymentsError extends Error {
  constructor(type: PaymentsErrorMessages, message: string) {
    super(message);
    this.name = 'PaymentsError';
    this.type = type;
  }

  type: PaymentsErrorMessages;
}

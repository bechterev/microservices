export type PaymentCompleteStopStep = {
  sagaId: string;
  orderId: string;
  userId: number;
  paymentStatus: number;
};

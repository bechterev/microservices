export class CreatePaymentEvent {
  constructor(readonly sagaId: string, readonly payment: any) {}
}

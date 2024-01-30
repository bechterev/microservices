export class InitNotifySagaCommand {
  constructor(
    readonly sagaId: string,
    readonly orderId: string,
    readonly userId: number,
    readonly paymentStatus: number,
  ) {}
}

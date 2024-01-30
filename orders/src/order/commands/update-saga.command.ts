export class UpdateSagaCommand {
  constructor(
    readonly sagaId: string,
    readonly userId: number,
    readonly paymentId: string,
    readonly balanceIsSufficient: boolean,
    readonly orderId: string,
  ) {}
}

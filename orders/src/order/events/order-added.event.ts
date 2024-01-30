export class OrderAddedEvent {
  public constructor(
    public readonly userId: number,
    public readonly orderId: string,
    public readonly price: number,
    public readonly currency: string,
  ) {}
}

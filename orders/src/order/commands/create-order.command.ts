export class CreateOrderCommand {
  constructor(
    public readonly userId: number,
    public readonly products: Array<string>,
  ) {}
}

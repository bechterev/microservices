export class UpdateOrderCommand {
  constructor(
    readonly id: string,
    readonly products?: Array<string>,
    readonly state?: string,
  ) {}
}

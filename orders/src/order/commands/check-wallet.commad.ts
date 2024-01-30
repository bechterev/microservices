export class CheckWalletCommand {
  constructor(
    readonly userId: number,
    readonly amount: number,
    readonly currency: string,
  ) {}
}

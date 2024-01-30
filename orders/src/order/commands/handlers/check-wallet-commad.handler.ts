import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckWalletCommand } from '../check-wallet.commad';

const PAIRS_CURRENCIES: Map<string, Map<string, number>> = new Map([
  [
    'USD',
    new Map([
      ['RUB', 90.087],
      ['EUR', 0.982],
      ['USD', 1],
    ]),
  ],
  [
    'RUB',
    new Map([
      ['USD', 0.011],
      ['EUR', 0.011],
      ['RUB', 1],
    ]),
  ],
  [
    'EUR',
    new Map([
      ['USD', 0.011],
      ['EUR', 1],
      ['RUB', 91.2],
    ]),
  ],
]);

const WALLET_AMOUNT = 3;

@CommandHandler(CheckWalletCommand)
export class CheckWalletCommandHandler
  implements ICommandHandler<CheckWalletCommand>
{
  async execute(command: CheckWalletCommand): Promise<boolean> {
    const { userId, amount, currency } = command;

    const walletCurrency = userId % 2 === 0 ? 'RUB' : 'USD';

    const userBalance = await this.findCurse(
      walletCurrency,
      WALLET_AMOUNT,
      currency,
    );

    if (!userBalance) {
      return false;
    }
    return userBalance > amount;
  }

  private async findCurse(
    walletCurency: string,
    walletAmount: number,
    paymentCurrency: string,
  ): Promise<number | null> {
    const curses = PAIRS_CURRENCIES.get(walletCurency);
    if (!curses) return null;

    const curs = curses.get(paymentCurrency);

    if (!curs) return null;

    return walletAmount * curs;
  }
}

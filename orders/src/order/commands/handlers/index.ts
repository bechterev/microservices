import { CheckWalletCommandHandler } from './check-wallet-commad.handler';
import { CompleteNotifySagaCommandHandler } from './complete-notify-saga.command.handler';
import { CreateOrderHandler } from './create-order.handler';
import { InitNotifySagaCommandHandler } from './init-notify-saga.command.handler';
import { InitSagaCommandHandler } from './init-saga.command.handler';
import { UpdateOrderStateHandler } from './update-order.handler';
import { UpdateSagaCommandHandle } from './update-saga.command.handler';

export const OrderCommandHandlers = [
  CreateOrderHandler,
  UpdateOrderStateHandler,
  CheckWalletCommandHandler,
  UpdateSagaCommandHandle,
  InitSagaCommandHandler,
  InitNotifySagaCommandHandler,
  CompleteNotifySagaCommandHandler,
];

import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { OrderNotify } from '../types/order-notify.type';
import { OrderStatusEvent } from '../events/order-status.event';

const EXCHANGE_NOTIFY_ORDER = 'notify.order';
const ROUTING_KEY_ORDER_COMPLETE = 'order.complete';

@Injectable()
export class MessageService {
  constructor(private readonly eventBus: EventBus) {}

  @RabbitSubscribe({
    exchange: EXCHANGE_NOTIFY_ORDER,
    routingKey: ROUTING_KEY_ORDER_COMPLETE,
  })
  public async pubSubHandler(msg: OrderNotify) {
    try {
      const { sagaId, email, order } = msg;

      this.eventBus.publish(
        new OrderStatusEvent(email, sagaId, {
          id: order.id,
          products: order.products,
          state: order.state,
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }
}

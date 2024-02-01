import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { Exchange, RabbitMQConfig } from 'src/config/rabbit.config';
import { OrderStatusEvent } from 'src/mailer-sender/events/order-status.event';
import { OrderNotify } from 'src/mailer-sender/types/order-notify.type';

const EXCHANGE_NOTIFY_ORDER = 'notify.order';
const ROUTING_KEY_ORDER_COMPLETE = 'order.complete';

@Injectable()
export class ConsumerService {
  private channelWrapper: ChannelWrapper;
  private logger = new Logger(ConsumerService.name);
  constructor(
    private readonly rabbitConfig: RabbitMQConfig,
    private readonly eventBus: EventBus,
  ) {
    this.initialize();
  }

  private initialize() {
    const connection = connect([this.rabbitConfig.uri]);
    this.channelWrapper = connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await Promise.all(
          this.rabbitConfig.exchanges.recipient.map((exchange: Exchange) => {
            return channel.assertExchange(exchange.name, 'topic', {
              durable: true,
            });
          }),
        );
        await Promise.all(
          this.rabbitConfig.exchanges.recipient.map((exchange: Exchange) => {
            return channel.assertQueue(exchange.queue, {
              durable: true,
              maxLength: 10,
              deadLetterExchange: 'dlx',
              deadLetterRoutingKey: 'dlx-routing-key',
            });
          }),
        );

        await Promise.all(
          this.rabbitConfig.exchanges.recipient.map((exchange: Exchange) => {
            return channel.bindQueue(
              exchange.queue,
              exchange.name,
              exchange.topic,
            );
          }),
        );

        await channel.consume(
          this.rabbitConfig.exchanges.recipient[0].queue,
          async (message) => {
            if (message) {
              const content = JSON.parse(message.content.toString());
              const { exchange, routingKey } = message.properties.headers;
              if (
                exchange === EXCHANGE_NOTIFY_ORDER &&
                routingKey === ROUTING_KEY_ORDER_COMPLETE
              ) {
                this.proccesSendNotify(content);
              }

              channel.ack(message);
            }
          },
        );

        this.logger.log('Channel setup completed for ConsumerService.');
      },
    });
  }

  async close() {
    await this.channelWrapper.close();
  }

  private async proccesSendNotify(msg: OrderNotify) {
    const { sagaId, email, order } = msg;

    this.eventBus.publish(
      new OrderStatusEvent(email, sagaId, {
        id: order.id,
        products: order.products,
        state: order.state,
      }),
    );
  }
}

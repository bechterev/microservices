import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RabbitMQConfig, Exchange } from 'src/configs/rabbit.config';
import { SagaOrderDataDto } from 'src/payment/dto/saga-order-data.dto';
import { SagaPaymentUpdateInfoDto } from 'src/payment/dto/saga-payment-update-info.dto';
import { OrderPaymentEvent } from 'src/payment/events/order-payment.event';
import { PaymentUpdateEvent } from 'src/payment/events/payment-update.event';

const PAYMENT_ORDER_EXCHANGE = 'payment.order';
const ORDER_PAY_TOPIC = 'order.pay';
const ORDER_PAY_START_TOPIC = 'order.pay.start';

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

        await channel.consume('paymentQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            const { exchange, routingKey } = message.properties.headers;
            if (
              exchange === PAYMENT_ORDER_EXCHANGE &&
              routingKey === ORDER_PAY_TOPIC
            ) {
              this.proccesPaymentCreate(content);
            }
            if (
              exchange === PAYMENT_ORDER_EXCHANGE &&
              routingKey === ORDER_PAY_START_TOPIC
            ) {
              this.proccesPaymentComplete(content);
            }
            this.logger.log(
              'Received message from paymentQueue:',
              content,
              exchange,
              routingKey,
            );

            channel.ack(message);
          }
        });

        this.logger.log('Channel setup completed for ConsumerService.');
      },
    });
  }

  async close() {
    await this.channelWrapper.close();
  }

  private async proccesPaymentCreate(msg: SagaOrderDataDto) {
    const { sagaId, ...data } = msg;
    this.eventBus.publish(new OrderPaymentEvent(sagaId, data));
  }

  private async proccesPaymentComplete(msg: SagaPaymentUpdateInfoDto) {
    this.eventBus.publish(new PaymentUpdateEvent(msg));
  }
}

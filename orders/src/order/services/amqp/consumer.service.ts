import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import amqp, { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RabbitMQConfig, Exchange } from 'src/configs/rabbit.config';
import { CreatePaymentEvent } from 'src/order/events/create-payment.event';
import { NotifyCompleteEvent } from 'src/order/events/notify-complete.event';
import { PaymentCompletEvent } from 'src/order/events/payment-complete.event';
import { ProducerService } from './producer.service';

const PAYMENT_EXCHANGE = 'order.payment';
const NOTIFY_EXCHANGE = 'order.notify';
const PAYMENT_CREATE_TOPIC = 'pay.order';
const PAYMENT_COMPLETE_TOPIC = 'pay.order.stop';
const NOTIFY_COMPLETE_TOPIC = 'complete.order';
const NOTIFY_FAILED_TOPIC = 'complete.order.failed';

@Injectable()
export class ConsumerService {
  private channelWrapper: ChannelWrapper;

  constructor(
    private readonly producerService: ProducerService,
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

        await channel.bindQueue('deadLetterQueue', 'dlx', 'dlx-routing-key');

        await channel.consume('orderQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            const { exchange, routingKey } = message.properties.headers;
            if (
              exchange === PAYMENT_EXCHANGE &&
              routingKey === PAYMENT_CREATE_TOPIC
            ) {
              this.proccesWalletCheck(content);
            }
            if (
              exchange === PAYMENT_EXCHANGE &&
              routingKey === PAYMENT_COMPLETE_TOPIC
            ) {
              this.proccesPaymentComplete(content);
            }
            if (
              exchange === NOTIFY_EXCHANGE &&
              routingKey === NOTIFY_COMPLETE_TOPIC
            ) {
              this.proccesNotify(content);
            }
            if (
              exchange === NOTIFY_EXCHANGE &&
              routingKey === NOTIFY_FAILED_TOPIC
            ) {
              this.proccesNotifyFailed(content);
            }
            Logger.log('Received message from paymentQueue:', content);

            channel.ack(message);
          }
        });

        await channel.consume('deadLetterQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            Logger.log('Received message from deadLetterQueue:', content);
            channel.ack(message);
          }
        });

        Logger.log('Channel setup completed for ConsumerService.');
      },
    });
  }

  async close() {
    await this.channelWrapper.close();
  }

  private async proccesWalletCheck(msg) {
    this.eventBus.publish(new CreatePaymentEvent(msg.sagaId, msg.payment));
  }

  private async proccesPaymentComplete(msg) {
    this.eventBus.publish(new PaymentCompletEvent(msg));
  }

  private async proccesNotify(msg) {
    this.eventBus.publish(new NotifyCompleteEvent(msg.sagaId));
  }

  private async proccesNotifyFailed(msg) {
    console.log('my msg', msg);
    const exchange = this.rabbitConfig.exchanges.sender[2];
    setTimeout(() => {
      this.producerService.addToQueue(msg, exchange);
    }, 5000);
  }
}

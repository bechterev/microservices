import { Injectable, Logger } from '@nestjs/common';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RabbitMQConfig, Exchange } from 'src/configs/rabbit.config';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;

  constructor(private readonly rabbitConfig: RabbitMQConfig) {
    this.initialize();
  }

  private initialize() {
    const connection = connect([this.rabbitConfig.uri]);

    this.channelWrapper = connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        const queues = new Map();
        await Promise.all(
          this.rabbitConfig.exchanges.sender.map((exchange: Exchange) => {
            if (exchange.queue && !queues.has(exchange.queue)) {
              queues.set(
                exchange.queue,
                channel.assertQueue(exchange.queue, {
                  durable: true,
                }),
              );
            }
            return channel.assertExchange(exchange.name, 'topic', {
              durable: true,
            });
          }),
        );
        await Promise.all([...queues.values()]);

        await Promise.all(
          this.rabbitConfig.exchanges.sender.filter((exchange: Exchange) => {
            if (exchange.queue) {
              return channel.bindQueue(
                exchange.queue,
                exchange.name,
                exchange.topic,
              );
            }
          }),
        );

        Logger.log('Channel setup completed for ProducerService.');
      },
    });
  }

  async paymentSend(data: any, ex?: Exchange) {
    try {
      const exchange: Exchange = ex || this.rabbitConfig.exchanges.sender[0];
      const routingKey = exchange.topic;

      await this.channelWrapper.sendToQueue(
        exchange.queue,
        Buffer.from(JSON.stringify(data)),
        {
          headers: { exchange: exchange.name, routingKey },
          expiration: 6000,
        },
      );

      Logger.log('Message added to the queue successfully.');
    } catch (error) {
      Logger.error('Error adding message to the queue', error.stack);
    }
  }

  async paymentComplete(data: any) {
    const exchange: Exchange = this.rabbitConfig.exchanges.sender[1];
    await this.paymentSend(data, exchange);
  }

  async close() {
    await this.channelWrapper.close();
  }
}

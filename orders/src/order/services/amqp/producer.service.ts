import { Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RabbitMQConfig, Exchange } from 'src/configs/rabbit.config';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  private logger = new Logger(ProducerService.name);
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
                  maxLength: 10,
                  deadLetterExchange: 'dlx',
                  deadLetterRoutingKey: 'dlx-routing-key',
                }),
              );
            }
            return channel.assertExchange(exchange.name, 'topic', {
              durable: true,
            });
          }),
        );
        await Promise.all([
          channel.assertQueue('deadLetterQueue', {
            durable: true,
          }),
          channel.assertExchange('dlx', 'topic', {
            durable: true,
          }),
          ...queues.values(),
        ]);

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
        await channel.bindQueue('deadLetterQueue', 'dlx', 'dlx-routing-key');
        this.logger.log('Channel setup completed for ProducerService.');
      },
    });
  }

  async addToQueue(data: any, ex?: Exchange) {
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

      this.logger.log('Message added to the queue successfully.');
    } catch (error) {
      this.logger.error('Error adding message to the queue', error.stack);
    }
  }

  async close() {
    await this.channelWrapper.close();
  }
}

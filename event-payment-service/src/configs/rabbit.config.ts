import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { RabbitMQQueueConfig } from '@golevelup/nestjs-rabbitmq';

export type Exchange = {
  name: string;
  topic: string;
  queue: string;
};

export type Exchanges = {
  recipient: Exchange[];
  sender: Exchange[];
};

@Injectable()
export class RabbitMQConfig {
  public readonly uri: string;
  public exchanges: Exchanges;
  public queueRecipients: RabbitMQQueueConfig;
  public queueSender: RabbitMQQueueConfig;

  constructor(configService: ConfigService) {
    this.uri = configService.getString('RABBIT_URI');
    this.exchanges = {
      recipient: [
        {
          name: 'payment.order',
          topic: 'order.pay',
          queue: 'paymentQueue',
        },
        {
          name: 'payment.order',
          topic: 'order.pay.start',
          queue: 'paymentQueue',
        },
      ],
      sender: [
        {
          name: 'order.payment',
          topic: 'pay.order',
          queue: 'orderQueue',
        },
        {
          name: 'order.payment',
          topic: 'pay.order.stop',
          queue: 'orderQueue',
        },
      ],
    };
  }
}

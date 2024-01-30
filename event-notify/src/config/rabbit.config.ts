import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

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

  constructor(configService: ConfigService) {
    this.uri = configService.getString('RABBIT_URI');
    this.exchanges = {
      recipient: [
        {
          name: 'notify.order',
          topic: 'order.complete',
          queue: 'notifyQueue',
        },
      ],
      sender: [
        {
          name: 'order.notify',
          topic: 'complete.order',
          queue: 'orderQueue',
        },
        {
          name: 'order.notify',
          topic: 'complete.order.failed',
          queue: 'orderQueue',
        },
      ],
    };
  }
}

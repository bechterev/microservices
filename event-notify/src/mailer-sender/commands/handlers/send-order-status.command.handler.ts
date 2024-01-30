import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendOrderStatusCommand } from '../send-order-status.command';
import { MailService } from 'src/mailer-sender/services/mail.service';
import { RabbitMQConfig } from 'src/config/rabbit.config';
import { ProducerService } from 'src/mailer-sender/services/amqp/producer.service';

@CommandHandler(SendOrderStatusCommand)
export class SendOrderStatusCommandHandler
  implements ICommandHandler<SendOrderStatusCommand>
{
  constructor(
    private readonly mailService: MailService,
    private readonly rabbitmqConfig: RabbitMQConfig,
    private readonly produceService: ProducerService,
  ) {}
  async execute(command: SendOrderStatusCommand): Promise<void> {
    const { sagaId, to, order } = command;
    let text: string;
    let subject: string;
    if (order.state === 2) {
      text = `Sorry, your order ${order.id} is failed`;
      subject = `problem with your order`;
    } else {
      text = `We excite to message you that your order ${order.id} success`;
      subject = `your order is success`;
    }
    const html = `<b>Hello</b><br><p><i>${text}</i></p>`;
    try {
      await this.mailService.sendMessage({
        html,
        subject,
        text,
        to,
      });
      console.log('otpa');
      await this.produceService.NotifySend({ sagaId });
    } catch (err) {
      console.log('error', err);
      await this.produceService.NotifySend({ sagaId, email: to, order }, true);
    }
  }
}

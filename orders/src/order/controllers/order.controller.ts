import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Order } from '../entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  createOrder(@Request() req, @Body() order: Partial<Order>): Promise<Order> {
    return this.orderService.createOrder(req.user.userId, order.products);
  }
}

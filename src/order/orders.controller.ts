/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request as ExpressRequest } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // create order
  @Post()
  createOrder(@Request() req: ExpressRequest, @Body() dto: CreateOrderDto) {
    const userId = (req.user as any).id;
    return this.ordersService.createOrder(userId, dto);
  }

  // get all orders for user
  @Get()
  getOrders(@Request() req: ExpressRequest) {
    const userId = (req.user as any).id;
    return this.ordersService.findByUser(userId);
  }

  // get single order by id
  @Get(':id')
  getOne(@Request() req: ExpressRequest, @Param('id') id: string) {
    const userId = Number((req.user as any).id);
    return this.ordersService.findOne(userId, Number(id));
  }
}

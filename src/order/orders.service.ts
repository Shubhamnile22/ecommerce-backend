/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ///ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Cart } from '../cart/cart.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Order) private ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  // Helper to transform DB entity into response shape Angular expects

  private mapOrderResponse(order: Order) {
    return {
      id: order.id,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      total: order.items.reduce(
        (sum, item) => sum + item.snapshotPrice * item.quantity,
        0,
      ),
      items: order.items.map((item) => ({
        product: {
          id: item.productId,
          name: item.productName,
          category: item.category,
        },
        snapshotPrice: item.snapshotPrice,
        quantity: item.quantity,
      })),
    };
  }

  //Create a new order
  async createOrder(userId: number, dto: CreateOrderDto): Promise<any> {
    // Find user
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    // Validate items
    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('Order items are required');
    }

    // Create order entity
    const order = new Order();
    order.shippingAddress = dto.shippingAddress;
    order.paymentMethod = dto.paymentMethod;
    order.user = user;
    order.items = [];

    // Attach order items
    for (const itemDto of dto.items) {
      const product = await this.productRepo.findOneBy({
        id: itemDto.productId,
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${itemDto.productId} not found`,
        );
      }

      const item = new OrderItem();
      item.productId = product.id;
      item.productName = product.name;
      item.productDescription = product.description;
      item.snapshotPrice = +itemDto.snapshotPrice;
      item.quantity = itemDto.quantity;
      item.category = product.category;
      item.order = order;

      order.items.push(item);
    }

    // Save order with items
    const savedOrder = await this.ordersRepo.save(order);

    return this.mapOrderResponse(savedOrder);
  }

  // Find all orders for a user

  async findByUser(userId: number): Promise<any[]> {
    const orders = await this.ordersRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
    // console.log('Orders fetched for userId', userId, ':', orders);
    return orders.map((o) => this.mapOrderResponse(o));
  }

  //Find a single order

  async findOne(userId: number, orderId: number): Promise<any> {
    const order = await this.ordersRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });
    // console.log(order);
    if (!order) throw new NotFoundException('Order not found');

    // Ensure both IDs are numbers
    if (Number(order.user.id) !== Number(userId)) {
      throw new ForbiddenException('Access denied');
    }

    return this.mapOrderResponse(order);
  }
}

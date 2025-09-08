import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';

// Load environment variables
config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Product, Cart, CartItem, Order, OrderItem],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

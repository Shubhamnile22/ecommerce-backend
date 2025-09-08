/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seeds/seed.module';
import { CartItem } from './cart/cart-item.entity';
import { Cart } from './cart/cart.entity';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';
import { CartModule } from './cart/cart.module';
import { PassportModule } from '@nestjs/passport';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { OrdersModule } from './order/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +(config.get<number>('DB_PORT') ?? 3306),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [User, Product, Cart, CartItem, Order, OrderItem],
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    PassportModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    SeedModule,
    CartModule,
    OrdersModule,
  ],
})
export class AppModule {}

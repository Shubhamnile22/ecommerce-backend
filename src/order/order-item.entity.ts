import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../products/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column('text', { nullable: true })
  productDescription: string;

  @Column('decimal', { precision: 10, scale: 2 })
  snapshotPrice: number;

  @Column()
  quantity: number;

  @Column()
  category: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    eager: false,
    onDelete: 'CASCADE',
  })
  product: Product;
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  // find or create cart for user
  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId } as any, items: [] });
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  // get user cart
  async getCart(userId: number): Promise<Cart> {
    return this.getOrCreateCart(userId);
  }

  // add item or increase quantity
  async addItem(userId: number, dto: AddItemDto): Promise<Cart> {
    if (dto.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const cart = await this.getOrCreateCart(userId);

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds stock');
    }

    let item = cart.items?.find((i) => i.product.id === product.id);

    if (item) {
      // update quantity
      const newQty = item.quantity + dto.quantity;
      if (newQty > product.stock) {
        throw new BadRequestException('Quantity exceeds stock');
      }
      item.quantity = newQty;
      await this.itemRepo.save(item);
    } else {
      // create new item
      item = this.itemRepo.create({
        cart,
        product,
        quantity: dto.quantity,
        snapshotPrice: Number(product.price),
      });
      await this.itemRepo.save(item);
    }

    return this.getCart(userId);
  }

  // update item quantity (0 = remove)
  async updateItem(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) throw new NotFoundException('Item not found');

    if (quantity <= 0) {
      await this.itemRepo.remove(item);
      return this.getCart(userId);
    }

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    if (quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds stock');
    }

    item.quantity = quantity;
    item.snapshotPrice = Number(product.price);
    await this.itemRepo.save(item);

    return this.getCart(userId);
  }

  // remove item from cart
  async removeItem(userId: number, productId: number): Promise<Cart> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) throw new NotFoundException('Item not found');

    await this.itemRepo.remove(item);
    return this.getCart(userId);
  }
}

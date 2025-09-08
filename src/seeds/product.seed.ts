/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class ProductSeedService {
  // inject the product repository
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // seed initial product data
  async run() {
    // ⚠️ Disable foreign key checks (dev only)

    // define initial product list
    const products: Partial<Product>[] = [
      {
        name: 'Laptop',
        description: 'A high performance laptop',
        price: 1200,
        stock: 10,
        category: 'Electronics',
        image: 'laptop.jpg',
      },
      {
        name: 'Headphones',
        description: 'Noise cancelling headphones',
        price: 200,
        stock: 25,
        category: 'Electronics',
        image: 'headphones.jpg',
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic mug for coffee lovers',
        price: 15,
        stock: 100,
        category: 'Home',
        image: 'mug.jpg',
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with powerful features',
        price: 800,
        stock: 15,
        category: 'Electronics',
        image: 'smartphone.jpg',
      },
      {
        name: 'Backpack',
        description: 'Durable travel backpack',
        price: 60,
        stock: 40,
        category: 'Accessories',
        image: 'backpack.jpg',
      },
      {
        name: 'Keyboard',
        description: 'Mechanical keyboard for gaming',
        price: 90,
        stock: 30,
        category: 'Electronics',
        image: 'keyboard.jpg',
      },
      {
        name: 'Mouse',
        description: 'Wireless ergonomic mouse',
        price: 40,
        stock: 50,
        category: 'Electronics',
        image: 'mouse.jpg',
      },
      {
        name: 'T-shirt',
        description: 'Comfortable cotton T-shirt',
        price: 25,
        stock: 80,
        category: 'Clothing',
        image: 'tshirt.jpg',
      },
      {
        name: 'Shoes',
        description: 'Running shoes for men',
        price: 100,
        stock: 35,
        category: 'Footwear',
        image: 'shoes.jpg',
      },
      {
        name: 'Watch',
        description: 'Stylish wrist watch',
        price: 150,
        stock: 20,
        category: 'Accessories',
        image: '',
      },
    ];

    // apply default image for products without image
    const withDefaults = products.map((p) => ({
      ...p,
      image: p.image && p.image.trim() !== '' ? p.image : 'default.jpg',
    }));

    // save all products to the database
    await this.productRepo.save(withDefaults);
  }
}

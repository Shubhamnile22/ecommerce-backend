import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  // inject product repository
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  // fetch all products from the database
  findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  // fetch a single product by ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });

    // throw an error if product is not found
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // create a new product entry in the database
  create(productData: Partial<Product>): Promise<Product> {
    // create a product entity instance
    const product = this.productRepo.create(productData);

    // save the product to the database
    return this.productRepo.save(product);
  }
}

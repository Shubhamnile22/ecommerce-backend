/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';

@Controller('products')
export class ProductsController {
  // inject the products service
  constructor(private readonly productsService: ProductsService) {}

  // fetch all products
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // fetch a single product by ID
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Product> {
    const product = await this.productsService.findOne(+id);

    // throw error if product not found
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  // upload a product along with an image
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        // folder to save uploaded product images
        destination: './uploads/products',

        // generate a unique filename for each uploaded image
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    // product data from request body
    @Body() body: Partial<Product>,

    // uploaded image file
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    // create product entry with uploaded image filename
    return this.productsService.create({
      ...body,
      image: file?.filename,
    });
  }
}

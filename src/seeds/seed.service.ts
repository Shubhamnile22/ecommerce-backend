import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProductSeedService } from './product.seed';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly productSeedService: ProductSeedService) {}

  async onModuleInit() {
    await this.productSeedService.run();
  }
}

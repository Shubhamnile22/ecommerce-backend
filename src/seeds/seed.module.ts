import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { ProductSeedService } from './product.seed';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductSeedService, SeedService],
})
export class SeedModule {}

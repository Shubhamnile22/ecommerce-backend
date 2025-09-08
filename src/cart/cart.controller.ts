/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Logger,
  Req,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateQtyDto } from './dto/update-qty.dto';
import { Request as ExpressRequest } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  private readonly logger = new Logger(CartController.name);

  /* Get current user's cart */
  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Request() req: ExpressRequest) {
    const userId = (req.user as any).id;
    this.logger.debug(`🔹 Fetching cart for userId=${userId}`);
    return this.cartService.getCart(userId);
  }

  /* Add product to cart */
  @UseGuards(JwtAuthGuard)
  @Post('items')
  async addItem(@Req() req, @Body() dto: AddItemDto) {
    const userId = (req.user as any).id;
    this.logger.debug(
      `🔹 Incoming AddItem Request: userId=${userId}, body=${JSON.stringify(dto)}`,
    );
    try {
      return await this.cartService.addItem(userId, dto);
    } catch (err) {
      this.logger.error('❌ Error in addItem', err.stack);
      throw err;
    }
  }

  /* Update product quantity in cart */
  @UseGuards(JwtAuthGuard)
  @Patch('items/:productId')
  updateItem(
    @Request() req: ExpressRequest,
    @Param('productId') productId: string,
    @Body() body: UpdateQtyDto,
  ) {
    const userId = (req.user as any).id;
    this.logger.debug(
      `🔹 Updating item in cart: userId=${userId}, productId=${productId}, quantity=${body.quantity}`,
    );
    return this.cartService.updateItem(
      userId,
      Number(productId),
      body.quantity,
    );
  }

  /* Remove product from cart */
  @UseGuards(JwtAuthGuard)
  @Delete('items/:productId')
  removeItem(
    @Request() req: ExpressRequest,
    @Param('productId') productId: string,
  ) {
    const userId = (req.user as any).id;
    this.logger.debug(
      `🔹 Removing item from cart: userId=${userId}, productId=${productId}`,
    );
    return this.cartService.removeItem(userId, Number(productId));
  }
}

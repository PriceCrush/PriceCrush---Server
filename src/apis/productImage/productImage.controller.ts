import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ProductImageService } from './productImage.service';

@Controller('productImage')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Get('/')
  async getAllImage() {
    return await this.productImageService.fetchAll();
  }

  @Get('/:id')
  getProductImage(@Param('id') productID: string) {
    return this.productImageService.findOne({ productID });
  }

  @Delete('/:id')
  deleteProductImage(@Param('id') productID: string) {
    return this.productImageService.delete({ productID });
  }
}

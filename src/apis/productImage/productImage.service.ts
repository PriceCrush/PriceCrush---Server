import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/productImage.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async fetchAll() {
    return await this.productImageRepository.find();
  }

  findOne({ productID }) {
    return this.productImageRepository.find({
      where: {
        product: {
          id: productID,
        },
      },
    });
  }

  async delete({ productID }) {
    const result = await this.productImageRepository.delete({
      product: { id: productID },
    });
    return result.affected ? '삭제 성공' : '삭제 실패';
  }
}

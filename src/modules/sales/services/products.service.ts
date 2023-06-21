import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

import type { CreateProductDto } from '../dtos/createProduct.dto';
import type { Product } from '../entities/product.entity';
import type { ProductsService } from './products.service.abstract';

@Injectable()
export class ProductsServiceImpl implements ProductsService {

  constructor(private readonly _productRepo: ProductRepository) {}

  public async findOne(id: string): Promise<Product> {
    const products = await this._productRepo.findOne({
      where: {
        id: id,
      },
    });

    if(!products ) throw new NotFoundException('Product not found');

    return products;
  }

  public async findAllByCategory(id: string): Promise<Product[]> {
    const products = await this._productRepo.find({
      where: {
        category: {
          id: id,
        },
      },
    });

    if(!products || !products.length) throw new NotFoundException('Products not found');

    return products;
  }

  public async findAll(): Promise<Product[]> {
    const products = await this._productRepo.find();

    if(!products || !products.length) throw new NotFoundException('Products not found');

    return products;
  }

  public async searchByName(name: string): Promise<Product[]> {
    const products = await this._productRepo.searchByName(name);

    if(!products || !products.length) throw new NotFoundException('Products not found');

    return products;
  }

  public async create(dto:  CreateProductDto): Promise<Product> {
    const product = await this._productRepo.createProduct(dto);

    if(!product) throw new UnprocessableEntityException('Failed to create product');

    return product;
  }

  public async delete(id: string): Promise<void> {
    const res = await this._productRepo.delete({ id });

    if (!res.affected) throw new BadRequestException('Failed to delete');
  }

}

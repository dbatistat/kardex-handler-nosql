import { Injectable } from '@nestjs/common';
import { Nack, RabbitRPC } from '@nestjs-plus/rabbitmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interface/Product.interface';
import { ProductDto } from './dto/Product.dto';
import { ChangeQtyProductDto } from './dto/ChangeQtyProduct.dto';
import { ChangePriceProductDto } from './dto/ChangePriceProduct.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'add-product',
    queue: 'kardex-nosql',
  })
  public async createOrUpdate(productDto: ProductDto) {
    console.log('ADD PRODUCT', productDto);
    try {
      const product = await this.findByByProductCode(productDto.productCode);
      if (!product) {
        const created = new this.productModel(productDto);
        return await created.save();
      }

      product.quantity = product.quantity + productDto.quantity;
      product.price = (product.price + productDto.price) / 2;
      await this.productModel.updateOne({ _id: product._id }, product);
    } catch (e) {
      return new Nack(false);
    }
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'add-qty-product',
    queue: 'kardex-nosql',
  })
  async addQtyProduct({ productCode, qty }: ChangeQtyProductDto) {
    console.log('ADD QTY', { productCode, qty });
    try {
      const entity = await this.findByByProductCode(productCode);
      if (!entity && qty <= 0) {
        return;
      }

      entity.quantity = entity.quantity + qty;

      await this.productModel.updateOne({ _id: entity._id }, entity);
    } catch (e) {
      console.log('ERROR: ', e);
      return new Nack(false);
    }
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'substract-qty-product',
    queue: 'kardex-nosql',
  })
  async substractQtyProduct({ productCode, qty }: ChangeQtyProductDto) {
    console.log('SUBSTRACT QTY', { productCode, qty });
    try {
      const entity = await this.findByByProductCode(productCode);
      if (!entity && qty <= 0) {
        return;
      }

      entity.quantity = entity.quantity - qty;

      await this.productModel.updateOne({ _id: entity._id }, entity);
    } catch (e) {
      console.log('ERROR: ', e);
      return new Nack(false);
    }
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'change-price-product',
    queue: 'kardex-nosql',
  })
  async changePriceProduct({ productCode, price }: ChangePriceProductDto) {
    console.log('CHANGE PRICE', { productCode, price });
    try {
      const entity = await this.findByByProductCode(productCode);
      if (!entity && price <= 0) {
        return;
      }

      entity.quantity = (entity.price + price) / 2;

      await this.productModel.updateOne({ _id: entity._id }, entity);
    } catch (e) {
      console.log('ERROR: ', e);
      return new Nack(false);
    }
  }

  private async findByByProductCode(productCode: string): Promise<Product> {
    return this.productModel.findOne({ productCode }).exec();
  }
}

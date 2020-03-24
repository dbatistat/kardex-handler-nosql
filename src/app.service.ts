import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@nestjs-plus/rabbitmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interface/Product.interface';
import { ProductDto } from './dto/Product.dto';
import { ChangeQtyProductDto } from './dto/ChangeQtyProduct.dto';
import { ChangePriceProductDto } from './dto/ChangePriceProduct.dto';
import { RabbitmqMessage } from './interface/rabbitmq-message.interface';

@Injectable()
export class AppService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) {
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'products',
    queue: 'kardex-nosql',
  })
  public async rabbitMQMessage({ route, data }: RabbitmqMessage) {
    switch (route) {
      case 'add-product':
        this.createOrUpdate(data);
        break;
      case 'add-qty-product':
        this.addQtyProduct(data);
        break;
      case 'substract-qty-product':
        this.substractQtyProduct(data);
        break;
      case 'change-price-product':
        this.changePriceProduct(data);
    }
  }

  private async addQtyProduct({ productCode, qty }: ChangeQtyProductDto) {
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
    }
  }

  private async substractQtyProduct({ productCode, qty }: ChangeQtyProductDto) {
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
    }
  }

  private async changePriceProduct({ productCode, price }: ChangePriceProductDto) {
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
    }
  }

  private async createOrUpdate({ productCode, qty, price }: ProductDto) {
    console.log('ADD PRODUCT', { productCode, qty, price });
    try {
      const product = await this.findByByProductCode(productCode);
      if (!product) {
        const created = new this.productModel({ productCode, quantity: qty, price });
        return await created.save();
      }

      product.quantity = product.quantity + qty;
      product.price = (product.price + price) / 2;
      await this.productModel.updateOne({ _id: product._id }, product);
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  private async findByByProductCode(productCode: string): Promise<Product> {
    return this.productModel.findOne({ productCode }).exec();
  }
}

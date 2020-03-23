import { Injectable } from '@nestjs/common';
import { Nack, RabbitRPC } from '@nestjs-plus/rabbitmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interface/Product.interface';
import { ProductDto } from './dto/Product.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel('Product') private productModel: Model<Product>) { }

  getHello(): string {
    return 'Hello World!';
  }

  async create(dto: ProductDto): Promise<Product> {
    const created = new this.productModel(dto);
    return created.save();
  }

  async update(id: number, quantityParam: number, priceParam: number): Promise<Product> {
    const entity = this.findBy(id);
    const qty = (await entity).quantity + quantityParam;
    const pricePn = (((await entity).price + priceParam) / 2);

    const updateDto = new ProductDto();
    updateDto.id = id;
    updateDto.price = pricePn;
    updateDto.quantity = qty;
    updateDto.productCode = (await entity).productCode;

    const updateModel = new this.productModel(updateDto);
    return updateModel.update(id, updateDto);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findBy(id: number): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'add-product',
    queue: 'kardex-nosql',
  })
  public async addProduct(dto: ProductDto) {
    console.log('RABBIT RESPONSE', dto);

    await this.update(dto.id, dto.quantity, dto.price);

    if (true) {
      return 100;
    } else if (false) {
      return new Nack(true);
    } else {
      // Will not be requeued
      return new Nack();
    }
  }
}

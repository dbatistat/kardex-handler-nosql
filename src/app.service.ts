import { Injectable } from '@nestjs/common';
import { Nack, RabbitRPC } from '@nestjs-plus/rabbitmq';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @RabbitRPC({
    exchange: 'kardex',
    routingKey: 'add-product',
    queue: 'kardex-nosql',
  })
  public async addProduct(msg: {}) {
    console.log('RABBIT RESPONSE', msg);
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

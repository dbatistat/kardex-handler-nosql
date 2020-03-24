import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://pharol:pharol@pharoldb-eyxl9.gcp.mongodb.net/kardex?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{name: 'Product', schema: ProductSchema}]),
    RabbitMQModule.forRoot({
      uri: 'amqp://user:kv8aq5f3tK9V@34.70.32.54:5672',
      exchanges: [
        {
          name: 'kardex',
          type: 'direct',
        },
      ],
    }),
  ],
  providers: [AppService],
})
export class AppModule {
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

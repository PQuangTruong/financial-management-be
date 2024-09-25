import { forwardRef, Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card, CardSchema } from './schema/card.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthsModule } from '../auths/auths.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => AuthsModule),
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}

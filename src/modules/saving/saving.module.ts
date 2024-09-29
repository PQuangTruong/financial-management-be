import { forwardRef, Module } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saving, savingSchema } from './schemas/saving.schema';
import { AuthsModule } from '../auths/auths.module';
import { CategoriesModule } from '../categories/categories.module';
import { CardsModule } from '../cards/cards.module';
import { Category, CategorySchema } from '../categories/schema/category.chema';
import { Card, CardSchema } from '../cards/schema/card.schema';

@Module({
  imports: [
    forwardRef(() => AuthsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CardsModule),
    MongooseModule.forFeature([
      { name: Saving.name, schema: savingSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [SavingController],
  providers: [SavingService],
  exports: [SavingService],
})
export class SavingModule {}

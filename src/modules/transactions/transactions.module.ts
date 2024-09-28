import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AuthsModule } from '../auths/auths.module';
import { Card, CardSchema } from '../cards/schema/card.schema';
import { CategoriesModule } from '../categories/categories.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [
    forwardRef(() => AuthsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CardsModule),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

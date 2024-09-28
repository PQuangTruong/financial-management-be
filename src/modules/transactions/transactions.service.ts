import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';
import { Card } from '../cards/schema/card.schema';
import { Category } from '../categories/schema/category.chema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private useTransModel: Model<Transaction>,
    @InjectModel(Card.name)
    private useCardModel: Model<Card>,
    @InjectModel(Category.name)
    private useCategoryModel: Model<Category>,
  ) {}

  async createTransaction(createTransactionDto, userId: string) {
    const { card_id, category_id, trans_amount, trans_type } =
      createTransactionDto;

    const card = await this.useCardModel.findById(card_id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const category = await this.useCategoryModel.findById(category_id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const transaction = await this.useTransModel.create({
      ...createTransactionDto,
      createdBy: userId,
    });

    const populatedTransaction = await this.useTransModel
      .findById(transaction._id)
      .populate('card_id')
      .populate('category_id')
      .exec();

    return {
      transaction: {
        amount: trans_amount,
        trans_type: trans_type,
      },
      card: {
        card_id: card._id,
        card_number: card.card_number,
        card_code: card.card_code,
        card_amount: card.card_amount,
      },
      populatedTransaction,
    };
  }

  async getUserTransactions(userId: string) {
    return await this.useTransModel
      .find({ createdBy: userId })
      .populate('card_id')
      .populate('category_id')
      .exec();
  }
}

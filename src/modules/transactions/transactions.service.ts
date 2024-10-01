import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';
import { Card } from '../cards/schema/card.schema';
import { Category } from '../categories/schema/category.chema';
import { CreatePayloadTransactionDto } from './dto/create-transaction.dto';
import { UpdatePayloadTransactionDto } from './dto/update-transaction.dto';

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

  async createTransaction(
    createTransactionDto: CreatePayloadTransactionDto,
    userId: string,
  ) {
    const {
      card_id,
      category_id,
      trans_amount,
      trans_type,
      trans_note,
      trans_date,
    } = createTransactionDto;

    const card = await this.useCardModel.findById(card_id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (trans_type === 'TT001' && card.card_amount < trans_amount) {
      throw new BadRequestException('Insufficient card balance');
    }

    const category = await this.useCategoryModel.findById(category_id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const transaction = await this.useTransModel.create({
      ...createTransactionDto,
      createdBy: userId,
      trans_date: createTransactionDto.trans_date || new Date(),
    });

    if (trans_type === 'TT001') {
      card.card_amount -= trans_amount;
    } else if (trans_type === 'TT002') {
      card.card_amount += trans_amount;
    }

    await card.save();

    const populatedTransaction = await this.useTransModel
      .findById(transaction._id)
      .populate('card_id')
      .populate('category_id')
      .exec();

    return {
      transaction: {
        trans_amount: transaction?.trans_amount,
        trans_type: transaction?.trans_type,
      },
      card: {
        card_id: card._id,
        card_number: card.card_number,
        card_code: card.card_code,
        card_amount: card.card_amount,
      },
      category: {
        category_name: category.cate_name,
      },
      populatedTransaction,
    };
  }

  async getTransactionsByType(userId: string, trans_type?: string) {
    const query: any = { createdBy: userId };
    console.log(userId);
    if (trans_type) {
      query.trans_type = trans_type;
    }

    const transactions = await this.useTransModel
      .find(query)
      .populate('card_id')
      .populate('category_id')
      .exec();

    console.log(transactions);
    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('No transactions found');
    }

    return transactions;
  }

  async updateTransaction(
    transactionId: string,
    updateTransactionDto: UpdatePayloadTransactionDto,
    userId: string,
  ) {
    const {
      card_id,
      category_id,
      trans_amount,
      trans_type,
      trans_note,
      trans_date,
    } = updateTransactionDto;

    const transaction = await this.useTransModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction does not exist');
    }

    const card = card_id
      ? await this.useCardModel.findById(card_id)
      : await this.useCardModel.findById(transaction.card_id);
    if (!card) {
      throw new NotFoundException('Card does not exist');
    }

    if (trans_type === 'TT001' && card.card_amount < trans_amount) {
      throw new BadRequestException('Insufficient card balance');
    }

    if (trans_type === 'TT001') {
      card.card_amount -= trans_amount;
    } else if (trans_type === 'TT002') {
      card.card_amount += trans_amount;
    }

    await card.save();

    const category = category_id
      ? await this.useCategoryModel.findById(category_id)
      : await this.useCategoryModel.findById(transaction.category_id);

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    Object.assign(transaction, updateTransactionDto);
    await transaction.save();

    const updatedTransaction = await this.useTransModel
      .findById(transactionId)
      .populate('card_id')
      .populate('category_id')
      .exec();

    return {
      transaction: updatedTransaction,
      card,
      category,
    };
  }

  async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await this.useTransModel.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction does not exist');
    }

    const card = await this.useCardModel.findById(transaction.card_id);
    if (!card) {
      throw new NotFoundException('Card does not exist');
    }

    if (transaction.trans_type === 'TT001') {
      card.card_amount += transaction.trans_amount;
    } else if (transaction.trans_type === 'TT002') {
      card.card_amount -= transaction.trans_amount;
    }

    await card.save();
    await this.useTransModel.findByIdAndDelete(transactionId);

    return { message: 'Transaction deleted successfully', card };
  }
}

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
import {
  UpdatePayloadTransactionDto,
  UpdateTransactionDto,
} from './dto/update-transaction.dto';

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
      throw new BadRequestException(
        'The amount of money on the card is not enough to make this transaction',
      );
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
      await card.save();
    } else if (trans_type === 'TT002') {
      card.card_amount += trans_amount;
      await card.save();
    }

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
    const filter = trans_type ? { trans_type } : {};

    const transactions = await this.useTransModel
      .find(filter)
      .populate('card_id')
      .populate('category_id')
      .exec();

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(
        `No transactions found ${trans_type ? trans_type : 'sir'}`,
      );
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
    const existingTransaction =
      await this.useTransModel.findById(transactionId);
    if (!existingTransaction) {
      throw new NotFoundException('Transaction does not exist');
    }

    const card = card_id
      ? await this.useCardModel.findById(card_id)
      : await this.useCardModel.findById(existingTransaction.card_id);

    if (!card) {
      throw new NotFoundException('Card does not exist');
    }

    if (trans_type === 'TT001') {
      if (card.card_amount < trans_amount) {
        throw new BadRequestException('Insufficient card balance');
      }
      card.card_amount -= trans_amount;
    } else if (trans_type === 'TT002') {
      card.card_amount += trans_amount;
    }

    await card.save();

    const category = category_id
      ? await this.useCategoryModel.findById(category_id)
      : await this.useCategoryModel.findById(existingTransaction.category_id);

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    existingTransaction.trans_amount =
      updateTransactionDto.trans_amount ?? existingTransaction.trans_amount;
    existingTransaction.trans_type =
      updateTransactionDto.trans_type ?? existingTransaction.trans_type;
    existingTransaction.trans_note =
      updateTransactionDto.trans_note ?? existingTransaction.trans_note;
    existingTransaction.trans_date =
      updateTransactionDto.trans_date ?? existingTransaction.trans_date;
    existingTransaction.card_id =
      updateTransactionDto.card_id ?? existingTransaction.card_id;
    existingTransaction.category_id =
      updateTransactionDto.category_id ?? existingTransaction.category_id;

    await existingTransaction.save();

    const updatedTransaction = await this.useTransModel
      .findById(transactionId)
      .populate('card_id')
      .populate('category_id')
      .exec();

    return {
      transaction: {
        trans_amount: updatedTransaction.trans_amount,
        trans_type: updatedTransaction.trans_type,
        trans_note: updatedTransaction.trans_note,
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
      updatedTransaction,
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

    return {
      message: 'Delete transaction successfully',
      card: {
        card_id: card._id,
        card_number: card.card_number,
        card_code: card.card_code,
        card_amount: card.card_amount,
      },
    };
  }
}

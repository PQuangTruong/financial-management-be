import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { Card } from '../cards/schema/card.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private useTransModel: Model<Transaction>,
    @InjectModel(Card.name)
    private useCardModal: Model<Card>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ) {
    const { card_id, trans_amount, trans_type } = createTransactionDto;

    // Kiểm tra thẻ có tồn tại không
    const card = await this.useCardModal.findById(card_id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // Kiểm tra loại giao dịch và cập nhật số tiền tương ứng
    if (trans_type === 'expense') {
      // Giảm số tiền trong thẻ nếu là giao dịch chi tiêu
      if (card.card_amount < trans_amount) {
        throw new BadRequestException('Insufficient funds on the card');
      }
      card.card_amount -= trans_amount;
    } else if (trans_type === 'income') {
      // Tăng số tiền trong thẻ nếu là giao dịch thu nhập
      card.card_amount += trans_amount;
    } else {
      throw new BadRequestException('Invalid transaction type');
    }

    // Lưu thay đổi cho thẻ
    await card.save();

    // Tạo mới giao dịch
    const transaction = await this.useTransModel.create({
      ...createTransactionDto,
      createdBy: userId,
    });

    return transaction;
  }
}

import { Injectable } from '@nestjs/common';
import {
  CreatePayloadSavingDto,
  CreateSavingDto,
} from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Saving } from './schemas/saving.schema';
import { SavingModule } from './saving.module';
import { Model } from 'mongoose';

@Injectable()
export class SavingService {
  constructor(
    @InjectModel(Saving.name)
    private useSavingModal: Model<Saving>,
  ) {}
  // async createSaving(createSavingDto: CreatePayloadSavingDto, userId: string) {
  //   const {} = createSavingDto;

  //   const card = await this.useSavingModal.findById(card_id);
  //   if (!card) {
  //     throw new NotFoundException('Card not found');
  //   }

  //   if (trans_type === 'TT001' && card.card_amount < trans_amount) {
  //     throw new BadRequestException(
  //       'The amount of money on the card is not enough to make this transaction',
  //     );
  //   }

  //   const category = await this.useCategoryModel.findById(category_id);
  //   if (!category) {
  //     throw new NotFoundException('Category not found');
  //   }

  //   const transaction = await this.useTransModel.create({
  //     ...createTransactionDto,
  //     createdBy: userId,
  //     trans_date: createTransactionDto.trans_date || new Date(),
  //   });

  //   if (trans_type === 'TT001') {
  //     card.card_amount -= trans_amount;
  //     await card.save();
  //   } else if (trans_type === 'TT002') {
  //     card.card_amount += trans_amount;
  //     await card.save();
  //   }

  //   const populatedTransaction = await this.useTransModel
  //     .findById(transaction._id)
  //     .populate('card_id')
  //     .populate('category_id')
  //     .exec();

  //   return {
  //     transaction: {
  //       trans_amount: transaction?.trans_amount,
  //       trans_type: transaction?.trans_type,
  //     },
  //     card: {
  //       card_id: card._id,
  //       card_number: card.card_number,
  //       card_code: card.card_code,
  //       card_amount: card.card_amount,
  //     },
  //     category: {
  //       category_name: category.cate_name,
  //     },
  //     populatedTransaction,
  //   };
  // }
}

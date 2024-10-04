import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePayloadSavingDto,
  CreateSavingDto,
} from './dto/create-saving.dto';
import {
  UpdatePayloadSavingDto,
  UpdateSavingDto,
} from './dto/update-saving.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Saving } from './schemas/saving.schema';
import { SavingModule } from './saving.module';
import { Model } from 'mongoose';
import { Category } from '../categories/schema/category.chema';
import { Card } from '../cards/schema/card.schema';
import { UpdatePayloadSavingAmountDto } from './dto/update-amount.dto';
import { GoalPayloadOptionDto } from './dto/goal-option.dto';

@Injectable()
export class SavingService {
  constructor(
    @InjectModel(Saving.name)
    private useSavingModal: Model<Saving>,
    @InjectModel(Card.name)
    private useCardModel: Model<Card>,
    @InjectModel(Category.name)
    private useCategoryModel: Model<Category>,
  ) {}

  async createSaving(createSavingDto: CreatePayloadSavingDto, userId: string) {
    const { saving_amount, saving_goal, saving_date, category_id, card_id } =
      createSavingDto;

    const category = await this.useCategoryModel.findById(category_id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const card = await this.useCardModel.findById(card_id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.card_amount < saving_amount) {
      throw new BadRequestException(
        'The amount of money on the card is not enough to make this transaction',
      );
    }

    card.card_amount -= saving_amount;
    await card.save();

    const savings = await this.useSavingModal.create({
      saving_amount: createSavingDto?.saving_amount,
      saving_goals_amount: createSavingDto?.saving_goal,
      createdBy: userId,
      category_id: createSavingDto.category_id,
      saving_date: createSavingDto.saving_date || new Date(),
    });

    const populatedSaving = await this.useSavingModal
      .findById(savings._id)
      .populate('category_id')
      .exec();

    return {
      populatedSaving,
    };
  }

  async updateSaving(
    savingId: string,
    updateSavingDto: UpdatePayloadSavingDto,
    userId: string,
  ) {
    const { category_id, saving_goal } = updateSavingDto;
    const existingTransaction = await this.useSavingModal.findById(savingId);
    if (!existingTransaction) {
      throw new NotFoundException('Transaction does not exist');
    }

    const category = category_id
      ? await this.useCategoryModel.findById(category_id)
      : await this.useCategoryModel.findById(existingTransaction.category_id);

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    existingTransaction.saving_goals_amount =
      updateSavingDto.saving_goal ?? existingTransaction.saving_goals_amount;
    existingTransaction.category_id =
      updateSavingDto.category_id ?? existingTransaction.category_id;

    await existingTransaction.save();

    const updatedTransaction = await this.useSavingModal
      .findById(savingId)
      .populate('category_id')
      .exec();

    return {
      category: {
        category_name: category.cate_name,
      },
      updatedTransaction,
    };
  }

  async getSavingsByType(saving_type?: string, userId?: string) {
    const query: any = { createdBy: userId };

    if (saving_type) {
      query.saving_type = saving_type;
    }

    const savings = await this.useSavingModal
      .find(query)
      .populate({ path: 'card_id' })
      .populate({ path: 'category_id' })
      .exec();

    if (!savings || savings.length === 0) {
      throw new NotFoundException('No savings found');
    }

    return savings;
  }

  async totalSaving(userId: string) {
    const savings = await this.useSavingModal.find({ createdBy: userId });

    const totalAmount = savings.reduce(
      (sum, saving) => sum + saving.saving_amount,
      0,
    );

    return {
      totalSavingAmount: totalAmount,
    };
  }

  async deleteSaving(savingId: string, cardId: string, userId: string) {
    const existingTransaction = await this.useSavingModal.findById(savingId);
    if (!existingTransaction) {
      throw new NotFoundException('Saving transaction does not exist');
    }

    if (existingTransaction.createdBy !== userId) {
      throw new NotFoundException(
        'Unauthorized access to this saving transaction',
      );
    }

    const card = await this.useCardModel.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    card.card_amount += existingTransaction.saving_amount;
    await card.save();

    await this.useSavingModal.findByIdAndDelete(savingId);

    return {
      message:
        'Saving transaction deleted successfully and amount refunded to the selected card',
    };
  }
}

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
      saving_date: createSavingDto.saving_date || new Date(),
    });

    const populatedSaving = await this.useSavingModal
      .findById(savings._id)
      .populate('category_id')
      .exec();

    return {
      category: {
        category_name: category.cate_name,
      },
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

  async updateSavingAmount(
    savingId: string,
    updateSavingDto: UpdatePayloadSavingAmountDto,
    userId: string,
  ) {
    const { card_id, saving_amount } = updateSavingDto;
    const existingTransaction = await this.useSavingModal.findById(savingId);
    if (!existingTransaction) {
      throw new NotFoundException('Transaction does not exist');
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

    const difference = saving_amount - existingTransaction.saving_amount;

    if (difference > 0) {
      if (card.card_amount < difference) {
        throw new BadRequestException(
          'The amount of money on the card is not enough to make this transaction',
        );
      }
      card.card_amount -= difference;
    } else if (difference < 0) {
      card.card_amount += Math.abs(difference);
    }

    await card.save();

    existingTransaction.saving_amount =
      updateSavingDto.saving_amount ?? existingTransaction.saving_amount;

    await existingTransaction.save();

    const updatedTransaction = await this.useSavingModal.findById(savingId);

    return {
      updatedTransaction,
    };
  }

  async checkSavingGoal(
    savingId: string,
    updateSavingDto: UpdatePayloadSavingAmountDto,
    userId: string,
  ) {
    const { card_id, saving_amount } = updateSavingDto;

    const saving = await this.useSavingModal.findById(savingId);
    if (!saving) {
      throw new NotFoundException('Saving transaction does not exist');
    }

    const card = await this.useCardModel.findById(card_id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (saving.saving_amount >= saving.saving_goals_amount) {
      return {
        message: 'Saving goal has been reached!',
        options: [
          {
            action: 'increase_goal',
            description: 'Do you want to increase the saving goal?',
          },
          {
            action: 'transfer_to_card',
            description:
              'Do you want to transfer the saved amount to the card?',
          },
        ],
      };
    }

    // Nếu chưa hoàn thành mục tiêu, chỉ cần lưu lại số tiền tiết kiệm
    await saving.save();
    return {
      message: 'Saving updated successfully',
      updatedSaving: saving,
    };
  }

  async handleSavingGoalOption(
    savingId: string,
    goalOptionDto: GoalPayloadOptionDto,
    userId: string,
  ) {
    const { card_id, saving_amount, saving_goal_amount, saving_option } =
      goalOptionDto;

    const saving = await this.useSavingModal.findById(savingId);
    if (!saving) {
      throw new NotFoundException('Saving transaction does not exist');
    }

    if (saving_option === 'SO001') {
      if (typeof saving_goal_amount !== 'number' || saving_goal_amount <= 0) {
        throw new BadRequestException('Invalid saving goal amount');
      }

      saving.saving_goals_amount += saving_goal_amount;
      await saving.save();
      return {
        message: 'Saving goal increased successfully',
        updatedSaving: saving,
      };
    } else if (saving_option === 'SO002' && card_id) {
      const card = await this.useCardModel.findById(card_id);
      if (!card) {
        throw new NotFoundException('Card not found');
      }

      card.card_amount += saving.saving_amount;
      saving.saving_amount = 0;
      await card.save();
      await saving.save();

      return {
        message: 'Saved amount transferred to the card successfully',
        updatedSaving: saving,
        updatedCard: card,
      };
    } else {
      throw new BadRequestException(
        'Invalid option or missing card information',
      );
    }
  }
  async getSavingById(savingId: string | undefined, userId: string) {
    let savings;
    if (savingId) {
      savings = await this.useSavingModal
        .findById(savingId)
        .populate('category_id')
        .exec();

      if (!savings || savings.createdBy !== userId) {
        throw new NotFoundException('Saving not found or unauthorized access');
      }

      return {
        savings,
        category: {
          category_name: savings.cate_name,
        },
      };
    }

    savings = await this.useSavingModal
      .find({ createdBy: userId })
      .populate('category_id');

    return savings.map((saving) => ({
      saving,
      category: {},
    }));
  }
}

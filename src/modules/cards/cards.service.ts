import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto, CreatePayloadCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Card } from './schema/card.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name)
    private useCardModal: Model<Card>,
    private readonly httpService: HttpService,
  ) {}

  isCardExist = async (card_number: number) => {
    const cardNumber = await this.useCardModal.exists({ card_number });
    if (cardNumber) return true;
    return false;
  };

  async getBankList() {
    const url = 'https://api.vietqr.io/v2/banks';
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data.data;
  }

  async searchBanks(bankName: string) {
    const bankList = await this.getBankList();
    const filteredBanks = bankList.filter((bank: any) =>
      bank.shortName.toLowerCase().includes(bankName.toLowerCase()),
    );
    if (filteredBanks.length === 0) {
      throw new BadRequestException('No banks found with that name');
    }
    return filteredBanks;
  }

  async create(payload: CreatePayloadCardDto, userId: string) {
    const { card_code, card_number, card_amount } = payload;

    const cardExisted = await this.isCardExist(card_number);
    if (cardExisted) {
      throw new BadRequestException('Card already exists');
    }

    const bankList = await this.getBankList();
    const validBank = bankList.find((bank: any) => bank.code === card_code);
    if (!validBank) {
      throw new BadRequestException('Invalid bank code');
    }

    const card = await this.useCardModal.create({
      card_full_name: validBank.name,
      card_short_name: validBank.shortName,
      card_number: payload?.card_number,
      card_amount: payload?.card_amount,
      card_code: payload?.card_code,
      card_logo: validBank.logo,
      createdBy: userId,
    });

    return card;
  }

  async getAllCard(userId: string) {
    const allCard = await this.useCardModal.find({ createdBy: userId });
    if (!allCard || allCard.length === 0) {
      throw new NotFoundException('Card not found');
    }
    return allCard;
  }

  async findById(_id: string) {
    const cateId = new Types.ObjectId(_id);
    return await this.useCardModal.findOne({ _id: cateId });
  }

  async findByCardNumber(card_number: number) {
    const cardNumber = card_number;
    return await this.useCardModal.findOne({ card_number: cardNumber });
  }

  async update(
    _id: string,
    payload: {
      card_code?: string;
      card_number?: number;
      card_amount?: number;
    },
    userId: string,
  ) {
    const card = await this.useCardModal.findOne({ _id, createdBy: userId });
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const bankList = await this.getBankList();
    const validBank = bankList.find(
      (bank: any) => bank.code === payload.card_code,
    );
    if (!validBank) {
      throw new BadRequestException('Invalid bank code');
    }
    card.card_full_name = validBank.name;
    card.card_short_name = validBank.shortName;
    card.card_code = payload.card_code ?? card.card_code;
    card.card_number = payload.card_number ?? card.card_number;
    card.card_amount = payload.card_amount ?? card.card_amount;

    await card.save();
    return card;
  }

  async removeCard(id: string, userId: string) {
    const cardDelete = await this.useCardModal.findOne({
      _id: id,
      createdBy: userId,
    });

    if (!cardDelete) {
      throw new NotFoundException('Card not found');
    }
    await this.useCardModal.findByIdAndDelete(id);

    return { message: 'Delete Card successfully' };
  }

  async updateCardAmount(
    cardId: string,
    card_number: number,
    trans_amount: number,
    trans_type: string,
  ) {
    const card = await this.useCardModal.findById(cardId);
    if (!card) {
      throw new NotFoundException('Not found your card id');
    }

    const cardNum = await this.findByCardNumber(card_number);
    if (!cardNum) {
      throw new NotFoundException('Not found your card account');
    }

    if (trans_type === 'expense') {
      if (card.card_amount < trans_amount) {
        throw new BadRequestException('Số dư trong thẻ không đủ');
      }
      card.card_amount -= trans_amount;
    } else if (trans_type === 'income') {
      card.card_amount += trans_amount;
    } else {
      throw new BadRequestException('Loại giao dịch không hợp lệ');
    }

    await card.save();

    return card;
  }

  async totalCardAmount(userId: string) {
    const cards = await this.useCardModal.find({ createdBy: userId });

    const totalCardAmount = cards.reduce(
      (sum, card) => sum + card.card_amount,
      0,
    );

    return {
      cards: cards.map((card) => ({
        card_name: card.card_short_name,
        card_number: card.card_number,
        card_amount: card.card_amount,
      })),
      totalAllCardAmount: totalCardAmount,
    };
  }
}

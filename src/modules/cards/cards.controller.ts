import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, CreatePayloadCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auths/passport/jwt-auth.guard';
import { AuthsService } from '../auths/auths.service';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly authService: AuthsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-card')
  async create(@Body() createCardDto: CreateCardDto, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { card_code, card_number, card_amount } = createCardDto.payload;
    return this.cardsService.create(
      { card_code, card_number, card_amount },
      decodedToken.userId,
    );
  }

  @Get('banks')
  async getBanks() {
    return this.cardsService.getBankList();
  }

  @Get('search-bank')
  async searchBank(@Query('name') bankName: string) {
    return this.cardsService.searchBanks(bankName);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-card')
  async getCard(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.cardsService.getAllCard(decodedToken.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-card/:id')
  async updateCard(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Request() req,
  ) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Token không được cung cấp');
    }
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    if (!decodedToken?.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const { card_code, card_number, card_amount } = updateCardDto.payload;

    return this.cardsService.update(
      id,
      { card_code, card_number, card_amount },
      decodedToken.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-card-amount/:id')
  async updateCardAmount(
    @Param('id') id: string, // id là cardId
    @Body() updateCardDto: UpdateCardDto,
    @Request() req,
  ) {
    const { card_number } = updateCardDto.payload;
    const { trans_amount, trans_type } = updateCardDto.transaction;

    // Truyền đúng cardId vào phương thức service
    return this.cardsService.updateCardAmount(
      id, // Chuyển cardId từ tham số
      card_number,
      trans_amount,
      trans_type,
    );
  }

  @Delete('delete-card/:id')
  remove(@Param('id') id: string) {
    return this.cardsService.removeCard(id);
  }
}

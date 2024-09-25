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
  @Get('get-card')
  async getCard(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.cardsService.getAllCard(decodedToken.userId);
  }

  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  // @Patch('update-card/:id')
  // async updateCard(
  //   @Param('id') id: string,
  //   @Body()
  //   payload: {
  //     card_code?: string;
  //     card_number?: number;
  //     card_amount?: number;
  //   },
  //   @Request() req,
  // ) {
  //   const token = req.headers.authorization.split(' ')[1];
  //   const decodedToken = await this.authService.validateToken(token);
  //   return this.cardsService.update(id, payload, decodedToken.userId);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}

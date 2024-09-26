import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthsService } from '../auths/auths.service';
import { JwtAuthGuard } from '../auths/passport/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly authService: AuthsService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('create-transaction')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return this.transactionsService.createTransaction(
      createTransactionDto,
      decodedToken.userId,
    );
  }
}

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
  Query,
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
    const {
      card_id,
      category_id,
      trans_amount,
      trans_type,
      trans_note,
      trans_date,
    } = createTransactionDto.payload;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return this.transactionsService.createTransaction(
      {
        card_id,
        category_id,
        trans_amount,
        trans_type,
        trans_note,
        trans_date,
      },
      decodedToken.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-transaction-type')
  async getTransactionsByType(
    @Body('payload') payload: { trans_type?: string },
  ) {
    return this.transactionsService.getTransactionsByType(payload?.trans_type);
  }

  @Patch('update-transaction/:id')
  async updateTransaction(
    @Param('id') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { card_id, category_id, trans_amount, trans_type, trans_note } =
      updateTransactionDto.payload;
    return this.transactionsService.updateTransaction(
      transactionId,
      { card_id, category_id, trans_amount, trans_type, trans_note },
      decodedToken.userId,
    );
  }

  // Trong TransactionsController
  @Delete('delete-transaction/:id')
  async deleteTransaction(@Param('id') transactionId: string, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return this.transactionsService.deleteTransaction(
      transactionId,
      decodedToken.userId,
    );
  }
}

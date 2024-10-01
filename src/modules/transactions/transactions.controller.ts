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

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly authService: AuthsService,
  ) {}

  @Post('create-transaction')
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.transactionsService.createTransaction(
      createTransactionDto.payload,
      decodedToken.userId,
    );
  }

  @Post('get-transaction-type')
  async getTransactionsByType(
    @Body('payload') payload: { trans_type?: string },
    @Request() req,
  ) {
    console.log(payload?.trans_type);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.transactionsService.getTransactionsByType(
      decodedToken.userId,
      payload?.trans_type,
    );
  }

  @Patch('update-transaction/:id')
  async updateTransaction(
    @Param('id') transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.transactionsService.updateTransaction(
      transactionId,
      updateTransactionDto.payload,
      decodedToken.userId,
    );
  }

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

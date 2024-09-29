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
import { SavingService } from './saving.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { AuthsService } from '../auths/auths.service';
import { JwtAuthGuard } from '../auths/passport/jwt-auth.guard';
import {
  UpdatePayloadSavingAmountDto,
  UpdateSavingAmountDto,
} from './dto/update-amount.dto';
import { GoalOptionDto } from './dto/goal-option.dto';

@UseGuards(JwtAuthGuard)
@Controller('saving')
export class SavingController {
  constructor(
    private readonly savingService: SavingService,
    private readonly authService: AuthsService,
  ) {}

  @Post('create-saving')
  async createSaving(@Body() createSavingDto: CreateSavingDto, @Request() req) {
    const { saving_amount, saving_goal, saving_date, category_id, card_id } =
      createSavingDto.payload;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.savingService.createSaving(
      {
        saving_amount,
        saving_goal,
        saving_date,
        category_id,
        card_id,
      },
      decodedToken.userId,
    );
  }

  @Patch('update-saving/:id')
  async updateSaving(
    @Param('id') savingId: string,
    @Body() updateSavingDto: UpdateSavingDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { category_id, saving_goal } = updateSavingDto.payload;
    return this.savingService.updateSaving(
      savingId,
      {
        category_id,
        saving_goal,
      },
      decodedToken.userId,
    );
  }

  @Patch('update-saving-amount/:id')
  async updateSavingAmount(
    @Param('id') savingId: string,
    @Body() updateSavingAmountDto: UpdateSavingAmountDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { card_id, saving_amount } = updateSavingAmountDto.payload;
    return this.savingService.updateSavingAmount(
      savingId,
      {
        card_id,
        saving_amount,
      },
      decodedToken.userId,
    );
  }

  @Post('check-saving-goal/:savingId')
  async checkGoal(
    @Param('savingId') savingId: string,
    @Body() checkGoalDto: UpdateSavingAmountDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { card_id, saving_amount } = checkGoalDto.payload;
    return this.savingService.checkSavingGoal(
      savingId,
      { card_id, saving_amount },
      decodedToken.userId,
    );
  }

  @Post('handle-saving-goal/:savingId')
  async handleGoalOption(
    @Param('savingId') savingId: string,
    @Body() body: GoalOptionDto,
    @Request() req,
  ) {
    const { card_id, saving_amount, saving_goal_amount, saving_option } =
      body.payload;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return this.savingService.handleSavingGoalOption(
      savingId,
      { card_id, saving_amount, saving_goal_amount, saving_option },
      decodedToken.userId,
    );
  }
}

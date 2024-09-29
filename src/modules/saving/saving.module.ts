import { Module } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saving, savingSchema } from './schemas/saving.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Saving.name, schema: savingSchema }]),
  ],
  controllers: [SavingController],
  providers: [SavingService],
  exports: [SavingService],
})
export class SavingModule {}

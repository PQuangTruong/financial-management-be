import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SavingService } from './saving.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';

@Controller('saving')
export class SavingController {
  constructor(private readonly savingService: SavingService) {}

  @Post()
  create(@Body() createSavingDto: CreateSavingDto) {
    return this.savingService.create(createSavingDto);
  }

  @Get()
  findAll() {
    return this.savingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavingDto: UpdateSavingDto) {
    return this.savingService.update(+id, updateSavingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingService.remove(+id);
  }
}

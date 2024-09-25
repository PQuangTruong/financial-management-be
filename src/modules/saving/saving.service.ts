import { Injectable } from '@nestjs/common';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';

@Injectable()
export class SavingService {
  create(createSavingDto: CreateSavingDto) {
    return 'This action adds a new saving';
  }

  findAll() {
    return `This action returns all saving`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saving`;
  }

  update(id: number, updateSavingDto: UpdateSavingDto) {
    return `This action updates a #${id} saving`;
  }

  remove(id: number) {
    return `This action removes a #${id} saving`;
  }
}

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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthsService } from '../auths/auths.service';
import { JwtAuthGuard } from '../auths/passport/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly authService: AuthsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-category')
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { cate_name } = createCategoryDto.payload;
    return this.categoriesService.create({ cate_name }, decodedToken.userId);
  }

  @Patch('update-cate/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const { cate_name } = updateCategoryDto.payload;
    return this.categoriesService.update(id, { cate_name });
  }

  @Delete('delete-cate/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}

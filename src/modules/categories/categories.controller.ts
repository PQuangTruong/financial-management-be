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
import {
  CreateCategoryDto,
  CreatePayloadCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthsService } from '../auths/auths.service';
import { JwtAuthGuard } from '../auths/passport/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly authService: AuthsService,
  ) {}

  @Post('create-category')
  async create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { cate_name, cate_type } = createCategoryDto.payload;
    return this.categoriesService.create(
      { cate_name, cate_type },
      decodedToken.userId,
    );
  }

  @Post('categories-type')
  async getCategoriesByType(
    @Body('payload') payload: { cate_type?: string },
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return await this.categoriesService.findCategoriesByType(
      decodedToken.userId,
      payload?.cate_type,
    ); 
  }

  @Patch('update-cate/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    const { cate_name, cate_type } = updateCategoryDto.payload;
    return this.categoriesService.update(
      id,
      { cate_name, cate_type },
      decodedToken.userId,
    );
  }

  @Delete('delete-cate/:id')
  async remove(@Param('id') id: string, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);
    return this.categoriesService.delete(id, decodedToken.userId);
  }
}

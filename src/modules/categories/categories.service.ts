import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  CreatePayloadCategoryDto,
} from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriesModule } from './categories.module';
import { Category } from './schema/category.chema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private useCateModal: Model<Category>,
  ) {}
  isCateExist = async (cate_name: string) => {
    const cateName = await this.useCateModal.exists({ cate_name });
    if (cateName) return true;
    return false;
  };

  async create(payload: CreatePayloadCategoryDto, userId: string) {
    const { cate_name, cate_type } = payload;
    const cateExisted = await this.isCateExist(cate_name);
    if (cateExisted) {
      throw new BadRequestException(`Category ${cate_name} is existed`);
    }
    const category = await this.useCateModal.create({
      cate_name: payload?.cate_name,
      cate_type: payload?.cate_type,
      createdBy: userId,
    });
    return category;
  }

  async findById(_id: string) {
    const cateId = new Types.ObjectId(_id);
    return await this.useCateModal.findOne({ _id: cateId });
  }

  async findCategoriesByType(cate_type?: string) {
    const query = cate_type ? { cate_type } : {};

    const categories = await this.useCateModal.find(query);
    if (categories.length === 0) {
      throw new NotFoundException(
        cate_type
          ? `Không tìm thấy danh mục nào với loại: ${cate_type}`
          : 'Không tìm thấy danh mục nào',
      );
    }

    return categories;
  }

  async update(
    _id: string,
    payload: {
      cate_name?: string;
      cate_type?: string;
    },
  ) {
    const cate = await this.useCateModal.findById(_id);
    if (!cate) {
      throw new NotFoundException('Category not found');
    }

    // Cập nhật các trường nếu có giá trị mới
    cate.cate_name = payload.cate_name ?? cate.cate_name;
    cate.cate_type = payload.cate_type ?? cate.cate_type;

    await cate.save();

    return cate;
  }
  async delete(id: string) {
    const cateDelete = await this.useCateModal.findById(id);

    if (!cateDelete) {
      throw new NotFoundException('Category not found');
    }
    await this.useCateModal.findByIdAndDelete(id);

    return {
      message: 'Delete category successfully',
    };
  }
}

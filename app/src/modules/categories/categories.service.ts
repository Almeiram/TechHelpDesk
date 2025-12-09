import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const cat = this.categoriesRepo.create(createCategoryDto);
    return this.categoriesRepo.save(cat);
  }

  findAll() {
    return this.categoriesRepo.find();
  }

  async findOne(id: number) {
    const cat = await this.categoriesRepo.findOneBy({ id });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const cat = await this.findOne(id);
    Object.assign(cat, updateCategoryDto);
    return this.categoriesRepo.save(cat);
  }

  async remove(id: number) {
    const cat = await this.findOne(id);
    return this.categoriesRepo.remove(cat);
  }
}

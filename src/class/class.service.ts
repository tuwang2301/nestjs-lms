import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Class } from './class.entity';
import { AddClassDTO } from './dto/addClass.dto';
import { UpdateClassDTO } from './dto/updateClass.dto';
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { ClassFilterDto } from "./dto/class.filter.dto";
import { PageMetaDto } from "../pagination/pageMeta.dto";
import { PageDto } from "../pagination/page.dto";

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}
  async getAllClasses(
    pageOptionsDto: PageOptionsDto,
    classFilter: ClassFilterDto
  ) {
    try {
     const queryBuilder = this.classRepository.createQueryBuilder('class');

      const skip = (pageOptionsDto.page - 1)*pageOptionsDto.take;

     queryBuilder
       .orderBy('class.id', pageOptionsDto.order)
       .skip(skip)
       .take(pageOptionsDto.take)

     if(classFilter.name){
       queryBuilder.where('class.name like :name', {name: `%${classFilter.name}%`});
     }

     if(classFilter.student_number){
       queryBuilder.andWhere('class.student_number = :student_number', {student_number: classFilter.student_number});
     }

     const itemCount = await queryBuilder.getCount();
     const {entities} = await queryBuilder.getRawAndEntities();

     const pageMetaDto = new PageMetaDto({pageOptionsDto,itemCount});

     return new PageDto(entities,pageMetaDto);


    } catch (e) {
      throw e;
    }
  }

  async createClass(ClassDTO: AddClassDTO) {
    try {
      if (
        (await this.classRepository.findOneBy({ name: ClassDTO.name })) !== null
      ) {
        throw new Error(`Class with name ${ClassDTO.name} already exist`);
      }
      return await this.classRepository.save(ClassDTO);
    } catch (e) {
      throw e;
    }
  }

  async updateClass(id: number, data: UpdateClassDTO) {
    try {
      if ((await this.classRepository.findOneById(id)) === null) {
        throw new Error('Class not found');
      }

      if (
        (await this.classRepository.findOneBy({
          name: data.name,
          id: Not(id),
        })) !== null
      ) {
        throw new Error(`Class with name ${data.name} already exist`);
      }
      return await this.classRepository.update(id, data);
    } catch (e) {
      throw e;
    }
  }

  async deleteClass(id: number) {
    try {
      if ((await this.classRepository.findOneById(id)) === null) {
        throw new Error('Class not found');
      }
      return await this.classRepository.delete(id);
    } catch (e) {
      throw e;
    }
  }

  async getClassInfo(id: number) {
    try {
      const classroom = await this.classRepository.findOne({
        select: {
          courses: {
            name: true,
          },
        },
        relations: {
          courses: true,
        },
        where: {
          id: id,
        },
      });
      if (!classroom) {
        throw new Error('Not found class');
      }
      return classroom;
    } catch (e) {
      throw e;
    }
  }
}

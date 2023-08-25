import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Class } from './class.entity';
import { AddClassDTO } from './dto/addClass.dto';
import { UpdateClassDTO } from './dto/updateClass.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}
  async getAllClasses() {
    try {
      return await this.classRepository.find();
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

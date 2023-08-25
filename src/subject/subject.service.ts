import { Injectable } from '@nestjs/common';
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';
import { AddSubjectDto } from "./dto/addSubject.dto";

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}
  async getAllSubjects() {
    try {
      return await this.subjectRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async createSubject(subjectDTO: AddSubjectDto) {
    try {
      const subject = await this.subjectRepository.findOneBy({
        name: subjectDTO.name,
      });
      if (subject !== null) {
        throw new Error('This name already exist');
      }
      return await this.subjectRepository.save(subjectDTO);
    } catch (e) {
      throw e;
    }
  }

  async updateSubject(id: number, data: UpdateSubjectDto) {
    try {
      const subject = await this.subjectRepository.findOneById(id);
      if (subject === null) {
        throw new Error('Subject not found');
      }
      return await this.subjectRepository.update(id, data);
    } catch (e) {
      throw e;
    }
  }

  async deleteSubject(id: number) {
    try {
      const subject = await this.subjectRepository.findOneById(id);
      if (subject === null) {
        throw new Error('Subject not found');
      }
      return await this.subjectRepository.delete(id);
    } catch (e) {
      throw e;
    }
  }
}

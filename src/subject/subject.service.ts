import { Injectable, Query } from "@nestjs/common";
import { UpdateSubjectDto } from './dto/updateSubject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';
import { AddSubjectDto } from "./dto/addSubject.dto";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { PageMetaDto } from "../pagination/pageMeta.dto";
import { PageDto } from "../pagination/page.dto";

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}
  async getSubjectsPagination(
    pageOptionsDto: PageOptionsDto,
    subjectFilter: UpdateSubjectDto,
  ) {
    try {
      const queryBuilder = this.subjectRepository.createQueryBuilder('subject');
      const skip = (pageOptionsDto.page - 1)*pageOptionsDto.take;

      queryBuilder
        .orderBy('subject.id',pageOptionsDto.order)
        .skip(skip)
        .take(pageOptionsDto.take)

      if(subjectFilter.name){
        queryBuilder.where('LOWER(subject.name) like LOWER(:name)', {name: `%${subjectFilter.name}%`})
      }

      if(subjectFilter.credit){
        queryBuilder.andWhere('subject.credit = :credit', {credit: subjectFilter.credit})
      }

      const itemCount = await queryBuilder.getCount();
      const {entities} = await queryBuilder.getRawAndEntities();

      const pageMeta = new PageMetaDto({pageOptionsDto, itemCount});
      return new PageDto(entities,pageMeta);
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

  async getAllSubjects() {
    try{
      return await this.subjectRepository.find();
    }catch (e){
      throw e;
    }
  }
}

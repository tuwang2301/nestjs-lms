import { Injectable, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Teacher } from "./teacher.entity";
import { Repository } from "typeorm";
import { UpdateTeacherDto } from "./dto/updateTeacher.dto";
import { Gender } from "../common/globalEnum";
import { Subject } from "../subject/subject.entity";
import { AssignSubjectDto } from "./dto/assignSubject.dto";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { PageMetaDto } from "../pagination/pageMeta.dto";
import { PageDto } from "../pagination/page.dto";

@Injectable()
export class TeacherService {
    constructor(
      @InjectRepository(Teacher)
      private readonly teacherRepository: Repository<Teacher>,
      @InjectRepository(Subject)
      private readonly subjectRepository: Repository<Subject>
    ) {
    }

    async getAllTeachers(
      pageOptionsDto: PageOptionsDto,
      teacherFilterDto: UpdateTeacherDto
    ) {
        try {
            const queryBuilder = this.teacherRepository.createQueryBuilder("teacher");
            const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;

            queryBuilder
              .orderBy("teacher.id", pageOptionsDto.order)
              .skip(skip)
              .take(pageOptionsDto.take);

            if (teacherFilterDto.full_name) {
                queryBuilder.where("teacher.full_name like :name", { name: `%${teacherFilterDto.full_name}%`  });
            }

            if (teacherFilterDto.dob) {
                queryBuilder.andWhere("teacher.dob = :dob", { dob: teacherFilterDto.dob });
            }

            if (teacherFilterDto.gender) {
                queryBuilder.andWhere("teacher.gender = :gender", { gender: teacherFilterDto.gender });
            }

            const itemCount = await queryBuilder.getCount();
            const { entities } = await queryBuilder.getRawAndEntities();

            const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
            return new PageDto(entities, pageMeta);
        } catch (error) {
            throw error;
        }
    }

    async createTeacher(teacherDTO: UpdateTeacherDto) {
        try {
            return await this.teacherRepository.save(teacherDTO);
        } catch (e) {
            throw e;
        }
    }

    async deleteTeacher(id: number) {
        try {
            const found = await this.teacherRepository.findOneById(id);
            if (found === null) {
                throw new Error("Teacher not found");
            }
            return await this.teacherRepository.delete(id);
        } catch (e) {
            throw e;
        }
    }

    async updateTeacher(id: number, data: UpdateTeacherDto) {
        try {
            const found = await this.teacherRepository.findOneById(id);
            if (found === null) {
                throw new Error("Teacher not found");
            }
            return await this.teacherRepository.update(id, data);
        } catch (e) {
            throw e;
        }
    }

    async assignSubject(assignDTO: AssignSubjectDto) {
        try {
            const teacher = await this.teacherRepository.findOne({
                relations: {
                    subjects: true
                },
                where: {
                    id: assignDTO.teacher_id
                }
            });
            if (teacher === null) {
                throw new Error("Teacher not found");
            }
            const subject = await this.subjectRepository.findOneById(
              assignDTO.subject_id
            );
            if (subject === null) {
                throw new Error("Subject not found");
            }
            const subs = teacher.subjects;
            if (!subs) {
                teacher.subjects = [];
                teacher.subjects.push(subject);
            } else {
                teacher.subjects.push(subject);
            }
            return this.teacherRepository.save(teacher);
        } catch (e) {
            throw e;
        }
    }

    async getAllSubjectsOfTeacher(id: number) {
        try {
            const teacher = await this.teacherRepository.findOneById(id);
            if (!teacher) {
                throw new Error("Teacher not found");
            }
            return await this.teacherRepository.find({
                select: {
                    subjects: {
                        name: true
                    }
                },
                relations: {
                    subjects: true
                },
                where: {
                    id: id
                }
            });
        } catch (e) {
            throw e;
        }
    }

    async getAllCoursesOfTeacher(id: number) {
        try {
            const teacher = await this.teacherRepository.findOneById(id);
            if (!teacher) {
                throw new Error("Teacher not found");
            }
            return await this.teacherRepository.find({
                select: {
                    courses: {
                        name: true
                    }
                },
                relations: {
                    courses: true
                },
                where: {
                    id: id
                }
            });
        } catch (e) {
            throw e;
        }
    }
}

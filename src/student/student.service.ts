import { Injectable, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddStudentDto } from "./dto/addStudent.dto";
import { Student } from "./student.entity";
import { UpdateStudentDto } from "./dto/updateStudent.dto";
import { Enrollment } from "../enrollment/enrollment.entity";
import { Course } from "../course/course.entity";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { StudentFilterDto } from "./dto/student.filter.dto";
import { PageMetaDto } from "../pagination/pageMeta.dto";
import { PageDto } from "../pagination/page.dto";

@Injectable()
export class StudentService {
    constructor(
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
      @InjectRepository(Enrollment)
      private readonly enrollmentRepository: Repository<Enrollment>,
      @InjectRepository(Course)
      private readonly courseRepository: Repository<Course>
    ) {
    }

    async getListStudents(
      pageOptionsDto: PageOptionsDto,
      studentFilter: StudentFilterDto
    ) {

        const queryBuilder = this.studentRepository.createQueryBuilder("student");

        const skip = (pageOptionsDto.page - 1)*pageOptionsDto.take;

        queryBuilder
          .orderBy("student.id", pageOptionsDto.order)
          .skip(skip)
          .take(pageOptionsDto.take);

        if (studentFilter.full_name) {
            queryBuilder.where("student.full_name like :name", { name: `%${studentFilter.full_name}%` });
        }
        if (studentFilter.dob) {
            queryBuilder.andWhere("student.dob = :dob", { dob: studentFilter.dob });
        }
        if (studentFilter.gender) {
            queryBuilder.andWhere("student.gender = :gender", { gender: studentFilter.gender });
        }
        if (studentFilter.conduct) {
            queryBuilder.andWhere("student.conduct = :conduct", { conduct: studentFilter.conduct });
        }
        if (studentFilter.rank) {
            queryBuilder.andWhere("student.rank = :rank", { rank: studentFilter.rank });
        }

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
        return new PageDto(entities, pageMeta);
    }

    async addStudent(studentDTO: AddStudentDto) {
        try {
            return await this.studentRepository.save(studentDTO);
        } catch (error) {
            throw error;
        }
    }

    async updateStudent(id: number, studentDTO: UpdateStudentDto) {
        try {
            if (await this.studentRepository.findOneById(id)) {
                throw new Error("Student not found");
            }
            return await this.studentRepository.update(id, studentDTO);
        } catch (error) {
            throw error;
        }
    }

    async deleteStudent(id: number) {
        try {
            if (await this.studentRepository.findOneById(id)) {
                throw new Error("Student not found");
            }
            return await this.studentRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async getCoursesOfStudent(id: number) {
        try {
            const student = await this.studentRepository.findOneById(id);
            if (!student) {
                throw new Error("Student not found");
            }
            return await this.enrollmentRepository.find({
                select: {
                    course: {
                        name: true
                    },
                    student: {
                        id: true
                    },
                    enroll_date: true
                },
                relations: {
                    student: true,
                    course: true
                },
                where: {
                    student: {
                        id: id
                    }
                }
            });

            // return await this.enrollmentRepository
            //   .createQueryBuilder('enrollment')
            //   .select('course.name')
            //   .leftJoinAndSelect('enrollment.course', 'course')
            //   .where('enrollment.studentId = :id', { id: id })
            //   .getMany();
        } catch (e) {
            throw e;
        }
    }
}

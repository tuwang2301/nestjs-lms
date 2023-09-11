import { Injectable, Query } from "@nestjs/common";
import { AddEnrollmentDTO } from "./dto/addEnrollment.dto";
import { UpdateEnrollmentDTO } from "./dto/updateEnrollment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "../student/student.entity";
import { Repository } from "typeorm";
import { Course } from "../course/course.entity";
import { Enrollment } from "./enrollment.entity";
import { PageOptionsDto } from "../pagination/pagesoption.dto";
import { PageMetaDto } from "../pagination/pageMeta.dto";
import { PageDto } from "../pagination/page.dto";

@Injectable()
export class EnrollmentService {
    constructor(
      @InjectRepository(Enrollment)
      private readonly enrollmentRepository: Repository<Enrollment>,
      @InjectRepository(Student)
      private readonly studentRepository: Repository<Student>,
      @InjectRepository(Course)
      private readonly courseRepository: Repository<Course>
    ) {
    }

    async getAllEnrollments(
      pageOptionsDto: PageOptionsDto,
      enrollmentFilter: UpdateEnrollmentDTO
    ) {
        try {
            const queryBuilder = this.enrollmentRepository.createQueryBuilder("enrollment");
            const skip = (pageOptionsDto.page - 1) * pageOptionsDto.take;

            queryBuilder
              .orderBy("enrollment.id", pageOptionsDto.order)
              .skip(skip)
              .take(pageOptionsDto.take);

            if (enrollmentFilter.course_id) {
                queryBuilder.where("enrollment.courseId = :courseId", { courseId: enrollmentFilter.course_id });
            }

            if (enrollmentFilter.student_id) {
                queryBuilder.andWhere("enrollment.studentId = :studentId", { studentId: enrollmentFilter.student_id });
            }

            if (enrollmentFilter.enroll_date) {
                queryBuilder.andWhere("enrollment.enroll_date = :enroll_date", { enroll_date: enrollmentFilter.enroll_date });
            }

            const itemCount = await queryBuilder.getCount();
            const { entities } = await queryBuilder.getRawAndEntities();

            const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
            return new PageDto(entities, pageMeta);
        } catch (e) {
            throw e;
        }
    }

    async createEnrollment(EnrollmentDTO: AddEnrollmentDTO) {
        try {
            const enroll = new Enrollment();
            enroll.enroll_date = new Date();
            const student = await this.studentRepository.findOneById(
              EnrollmentDTO.student_id
            );
            if (student === null) {
                throw new Error("Student not found");
            }
            enroll.student = student;
            const course = await this.courseRepository.findOneById(
              EnrollmentDTO.course_id
            );
            if (course === null) {
                throw new Error("Course not found");
            }
            enroll.course = course;
            return await this.enrollmentRepository.save(enroll);
        } catch (e) {
            throw e;
        }
    }

    async updateEnrollment(id: number, data: UpdateEnrollmentDTO) {
        try {
            const enroll = await this.enrollmentRepository.findOneById(id);
            if (enroll === null) {
                throw new Error("Enrollment not found");
            }
            if (!data.student_id) {
                const student = await this.studentRepository.findOneById(
                  data.student_id
                );
                if (student === null) {
                    throw new Error("Student not found");
                }
                enroll.student = student;
            }
            if (!data.course_id) {
                const course = await this.courseRepository.findOneById(data.course_id);
                if (course === null) {
                    throw new Error("Course not found");
                }
                enroll.course = course;
            }
            return await this.enrollmentRepository.update(id, enroll);
        } catch (e) {
            throw e;
        }
    }

    async deleteEnrollment(id: number) {
        try {
            const enroll = await this.enrollmentRepository.findOneById(id);
            if (enroll === null) {
                throw new Error("Enrollment not found");
            }
            return await this.enrollmentRepository.delete(id);
        } catch (e) {
            throw e;
        }
    }

    async getEnrollmentInfo(id: number) {
        try {
            const enroll = await this.enrollmentRepository.findOneById(id);
            if (enroll === null) {
                throw new Error("Enrollment not found");
            }
            return await this.enrollmentRepository.find({
                relations: {
                    student: true,
                    course: true
                },
                where: {
                    id: id
                }
            });
        } catch (e) {
            throw e;
        }
    }

    async getMostEnrolledCourse() {
        try{
            const query = this.enrollmentRepository.createQueryBuilder('enrollment');
            query
              .select('enrollment.courseId', 'course_id')
              .addSelect('COUNT(*)', 'enroll')
              .groupBy('enrollment.courseId')
              .orderBy('enroll', 'DESC')
              .limit(3)
            const mostEnrollIds = await query.getRawMany().then(data => data.map(data => data.course_id));
            const mostEnrolledCourses = [];

            for (let i = 0; i < 3; i++) {
                const course =
                  await this.courseRepository.createQueryBuilder('course')
                    .leftJoinAndSelect('course.teacher', 'teacher')
                    .leftJoinAndSelect('course.subject', 'subject')
                    .where('course.id = :id',{id: mostEnrollIds[i]})
                    .getOne()
                mostEnrolledCourses.push(course)
            }

            return mostEnrolledCourses;
        }catch (e){
            throw e;
        }
    }
}

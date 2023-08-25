import { Injectable } from '@nestjs/common';
import { AddEnrollmentDTO } from './dto/addEnrollment.dto';
import { UpdateEnrollmentDTO } from './dto/updateEnrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../student/student.entity';
import { Repository } from 'typeorm';
import { Course } from '../course/course.entity';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async getAllEnrollments() {
    try {
      return await this.enrollmentRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async createEnrollment(EnrollmentDTO: AddEnrollmentDTO) {
    try {
      const enroll = new Enrollment();
      enroll.enroll_date = new Date();
      const student = await this.studentRepository.findOneById(
        EnrollmentDTO.student_id,
      );
      if (student === null) {
        throw new Error('Student not found');
      }
      enroll.student = student;
      const course = await this.courseRepository.findOneById(
        EnrollmentDTO.course_id,
      );
      if (course === null) {
        throw new Error('Course not found');
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
        throw new Error('Enrollment not found');
      }
      if (!data.student_id) {
        const student = await this.studentRepository.findOneById(
          data.student_id,
        );
        if (student === null) {
          throw new Error('Student not found');
        }
        enroll.student = student;
      }
      if (!data.course_id) {
        const course = await this.courseRepository.findOneById(data.course_id);
        if (course === null) {
          throw new Error('Course not found');
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
        throw new Error('Enrollment not found');
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
        throw new Error('Enrollment not found');
      }
      return await this.enrollmentRepository.find({
        relations: {
          student: true,
          course: true,
        },
        where: {
          id: id,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}

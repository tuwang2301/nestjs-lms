import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddStudentDto } from './dto/addStudent.dto';
import { Student } from './student.entity';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { Enrollment } from '../enrollment/enrollment.entity';
import { Course } from '../course/course.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async getListStudents() {
    return this.studentRepository.find();
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
        throw new Error('Student not found');
      }
      return await this.studentRepository.update(id, studentDTO);
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(id: number) {
    try {
      if (await this.studentRepository.findOneById(id)) {
        throw new Error('Student not found');
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
        throw new Error('Student not found');
      }
      return await this.enrollmentRepository.find({
        select: {
          course: {
            name: true,
          },
          student: {
            id: true,
          },
          enroll_date: true,
        },
        relations: {
          student: true,
          course: true,
        },
        where: {
          student: {
            id: id,
          },
        },
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

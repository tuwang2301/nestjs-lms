import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { AddCourseDto } from './dto/addCourse.dto';
import { Subject } from '../subject/subject.entity';
import { Teacher } from '../teacher/teacher.entity';
import { Class } from '../class/class.entity';
import { AssignTeacherDTO } from './dto/assignTeacher.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}
  async getAllCourses() {
    try {
      return await this.courseRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async deleteCourse(id: number) {
    try {
      if ((await this.courseRepository.findOneById(id)) === null) {
        throw new Error('Course not found');
      }
      return await this.courseRepository.delete(id);
    } catch (e) {
      throw e;
    }
  }

  async updateCourse(id: number, data: UpdateCourseDto) {
    try {
      const found = await this.courseRepository.findOneById(id);
      if (found === null) {
        throw new Error('Course not found');
      }
      if (!data.name) {
        found.name = data.name;
      }
      if (!data.start_at) {
        found.start_at = data.start_at;
      }
      if (!data.end_at) {
        found.end_at = data.end_at;
      }
      if (!data.class_room_id) {
        const _class = await this.classRepository.findOneById(
          data.class_room_id,
        );
        if (_class === null) {
          throw new Error('Class not found');
        } else {
          found.class_room = _class;
        }
      }
      if (!data.subject_id) {
        const subject = await this.subjectRepository.findOneById(
          data.subject_id,
        );
        if (subject === null) {
          throw new Error('Subject not found');
        } else {
          found.subject = subject;
        }
      }
      if (!data.teacher_id) {
        const teacher = await this.teacherRepository.findOneById(
          data.teacher_id,
        );
        if (teacher === null) {
          throw new Error('Teacher not found');
        } else {
          found.teacher = teacher;
        }
      }
      return await this.courseRepository.update(id, found);
    } catch (e) {
      throw e;
    }
  }

  async createCourse(CourseDTO: AddCourseDto) {
    try {
      if (
        (await this.courseRepository.findOneBy({ name: CourseDTO.name })) !==
        null
      ) {
        throw new Error(`Course with name ${CourseDTO.name} already exist`);
      }
      const subject = await this.subjectRepository.findOneById(
        CourseDTO.subject_id,
      );
      if (subject === null) {
        throw new Error(`Subject with id ${CourseDTO.subject_id} not exist`);
      }
      const _class = await this.classRepository.findOneById(
        CourseDTO.class_room_id,
      );
      if (_class === null) {
        throw new Error(`Class with id ${CourseDTO.class_room_id} not exist`);
      }
      const newCourse = new Course();
      newCourse.name = CourseDTO.name;
      newCourse.subject = subject;
      newCourse.class_room = _class;
      newCourse.start_at = CourseDTO.start_at;
      newCourse.end_at = CourseDTO.end_at;
      return await this.courseRepository.save(newCourse);
    } catch (e) {
      throw e;
    }
  }

  async assignTeacher(assignDTO: AssignTeacherDTO) {
    try {
      const course = await this.courseRepository.findOne({
        relations: {
          subject: true,
        },
        where: {
          id: assignDTO.course_id,
        },
      });
      if (!course) {
        throw new Error('Course not found');
      }
      const teacher = await this.teacherRepository.findOne({
        relations: {
          subjects: true,
        },
        where: {
          id: assignDTO.teacher_id,
        },
      });
      if (!teacher) {
        throw new Error('Teacher not found');
      }
      if (
        !teacher.subjects.find((subject) => {
          return subject.id === course.subject.id;
        })
      ) {
        throw new Error(
          `This teacher do not teach subject ${course.subject.name}`,
        );
      }
      course.teacher = teacher;
      return this.courseRepository.update(assignDTO.course_id, course);
    } catch (e) {
      throw e;
    }
  }

  async getCourseInfo(id: number) {
    try {
      const course = await this.courseRepository.findOne({
        select: {
          subject: {
            name: true,
          },
          teacher: {
            full_name: true,
          },
          class_room: {
            name: true,
          },
        },
        relations: {
          subject: true,
          teacher: true,
          class_room: true,
        },
        where: {
          id: id,
        },
      });
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (e) {
      throw e;
    }
  }
}
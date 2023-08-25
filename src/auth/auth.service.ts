import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/users.entity';
import { Role } from '../role/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { Student } from '../student/student.entity';
import { Teacher } from '../teacher/teacher.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async signIn(username: string, pass: string) {
    try {
      const user = await this.userRepository.findOne({
        relations: {
          roles: true,
        },
        where: {
          username: username,
        },
      });
      if (!user) {
        throw new Error('Not found username');
      }
      const checkPass = await compare(pass, user.password);
      if (!checkPass) {
        throw new Error('Sign in fail, Check again username and password');
      }
      const payload = {
        id: user.id,
        username: user.username,
        roles: user.roles,
      };
      return {
        user,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (e) {
      throw e;
    }
  }

  async signUpStudent(data: SignupDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          username: data.username,
        },
      });
      if (user) {
        throw new Error('Username already exist');
      }
      const studentfound = await this.studentRepository.findOne({
        where: {
          email: data.email,
        },
      });
      if (studentfound) {
        throw new Error('Student email already exist');
      }
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password, saltOrRounds);

      const student = await this.roleRepository.findOne({
        where: {
          authority: 'student',
        },
      });

      const newUser = new Users();
      newUser.username = data.username;
      newUser.password = hash;
      newUser.roles = [];
      newUser.roles.push(student);

      const newStudent = new Student();
      newStudent.full_name = data.full_name;
      newStudent.email = data.email;
      newStudent.gender = data.gender;
      newStudent.dob = data.dob;
      newStudent.user = newUser;

      const result = await this.userRepository.save(newUser);
      this.studentRepository.save(newStudent);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async signUpTeacher(data: SignupDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          username: data.username,
        },
      });
      if (user) {
        throw new Error('Username already exist');
      }
      const teacherFound = await this.teacherRepository.findOne({
        where: {
          email: data.email,
        },
      });
      if (teacherFound) {
        throw new Error('Student email already exist');
      }
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password, saltOrRounds);

      const teacher = await this.roleRepository.findOne({
        where: {
          authority: 'teacher',
        },
      });

      const newUser = new Users();
      newUser.username = data.username;
      newUser.password = hash;
      newUser.roles = [];
      newUser.roles.push(teacher);

      const newTeacher = new Student();
      newTeacher.full_name = data.full_name;
      newTeacher.email = data.email;
      newTeacher.gender = data.gender;
      newTeacher.dob = data.dob;
      newTeacher.user = newUser;

      const result = await this.userRepository.save(newUser);
      this.teacherRepository.save(newTeacher);
      return result;
    } catch (e) {
      throw e;
    }
  }
  
}

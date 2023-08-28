import { Get, Injectable, Param } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Users } from "../users/users.entity";
import { Role } from "../role/role.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { compare } from "bcrypt";
import { SignupDto } from "./dto/signup.dto";
import { Student } from "../student/student.entity";
import { Teacher } from "../teacher/teacher.entity";
import { Emailverification } from "./emailverification.entity";
import config from "./config";

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
      @InjectRepository(Emailverification)
      private emailVerifyRepository: Repository<Emailverification>
    ) {
    }

    async signIn(username: string, pass: string) {
        try {
            const user = await this.userRepository.findOne({
                relations: {
                    roles: true
                },
                where: {
                    username: username
                }
            });
            if (!user) {
                throw new Error("Not found username");
            }
            if (!user.is_valid) {
                throw new Error("Login mail not verified");
            }
            const checkPass = await compare(pass, user.password);
            if (!checkPass) {
                throw new Error("Sign in fail, Check again username and password");
            }
            const payload = {
                id: user.id,
                username: user.username,
                roles: user.roles
            };
            return {
                user,
                access_token: await this.jwtService.signAsync(payload)
            };
        } catch (e) {
            throw e;
        }
    }

    async signUpStudent(data: SignupDto) {
        try {
            const check1 = await this.userRepository.findOne({
                where: {
                    username: data.username
                }
            });
            if (check1) {
                throw new Error("Username already exist");
            }
            const check2 = await this.userRepository.findOne({
                where: {
                    email: data.email
                }
            });
            if (check2) {
                throw new Error("Email already exist");
            }

            const saltOrRounds = 10;
            const hash = await bcrypt.hash(data.password, saltOrRounds);

            const student = await this.roleRepository.findOne({
                where: {
                    authority: "student"
                }
            });

            const newUser = new Users();
            newUser.username = data.username;
            newUser.password = hash;
            newUser.email = data.email;
            newUser.roles = [];
            newUser.roles.push(student);

            const newStudent = new Student();
            newStudent.full_name = data.full_name;
            newStudent.gender = data.gender;
            newStudent.dob = data.dob;
            newStudent.user = newUser;

            const result = await this.userRepository.save(newUser);
            await this.studentRepository.save(newStudent);
            return result;
        } catch (e) {
            throw e;
        }
    }

    async signUpTeacher(data: SignupDto) {
        try {
            const check1 = await this.userRepository.findOne({
                where: {
                    username: data.username
                }
            });
            if (check1) {
                throw new Error("Username already exist");
            }

            const check2 = await this.userRepository.findOne({
                where: {
                    email: data.email
                }
            });
            if (check2) {
                throw new Error("Email already exist");
            }

            const saltOrRounds = 10;
            const hash = await bcrypt.hash(data.password, saltOrRounds);

            const teacher = await this.roleRepository.findOne({
                where: {
                    authority: "teacher"
                }
            });

            const newUser = new Users();
            newUser.username = data.username;
            newUser.password = hash;
            newUser.roles = [];
            newUser.roles.push(teacher);

            const newTeacher = new Student();
            newTeacher.full_name = data.full_name;
            newTeacher.gender = data.gender;
            newTeacher.dob = data.dob;
            newTeacher.user = newUser;

            const result = await this.userRepository.save(newUser);
            await this.teacherRepository.save(newTeacher);
            return result;
        } catch (e) {
            throw e;
        }
    }

    async createEmailToken(email: string) {
        const user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new Error("Not found user");
        }
        const emailVerification = await this.emailVerifyRepository.findOneBy({
            email: email
        });
        if (!emailVerification) {
            const newEmail = new Emailverification();
            newEmail.email = email;
            newEmail.emailToken = (
              Math.floor(Math.random() * 900000) + 100000
            ).toString();
            newEmail.timestamp = new Date();
            return await this.emailVerifyRepository.save(newEmail);
        } else if (
          emailVerification &&
          (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 <
          15
        ) {
            throw new Error("LOGIN.EMAIL_SENT_RECENTLY");
        } else {
            emailVerification.emailToken = (
              Math.floor(Math.random() * 900000) + 100000
            ).toString();
            emailVerification.timestamp = new Date();
            return await this.emailVerifyRepository.update(
              emailVerification.id,
              emailVerification
            );
        }
    }

    async sendEmailVerification(email: string) {
        try {
            const user = await this.userRepository.findOneBy({ email: email });
            if (!user) {
                throw new Error("Not found user");
            }
            const model = await this.emailVerifyRepository.findOneBy({
                email: email
            });

            if (model && model.emailToken) {
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "quangtu2301@gmail.com",
                        pass: "tcvpyneqxrlxufnr"
                    }
                });

                const mailOptions = {
                    from: "Company TuWang",
                    to: email, // list of receivers (separated by ,)
                    subject: "Verify Email",
                    text: "Verify Email",
                    html: "Hi! Thanks for your registration" +
                      "<p>Here is your token <b>" + model.emailToken + "</b>"
                    // '<a href=' + config.host.url + ':' + config.host.port + "/auth/verify/" + model.emailToken + "\">Click here to activate your account</a>"  // html body
                };

                const sent = await new Promise<boolean>(async function(resolve, reject) {
                    return await transporter.sendMail(
                      mailOptions,
                      async (error, info) => {
                          if (error) {
                              console.log("Message sent: %s", error);
                              return reject(false);
                          }
                          console.log("Message sent: %s", info.messageId);
                          resolve(true);
                      }
                    );
                });
                return sent;
            } else {
                throw new Error("REGISTER.USER_NOT_REGISTERED");
            }
        } catch (e) {
            throw e;
        }
    }

    async verifyEmail(email: string, token: string) {
        try {
            const user = await this.userRepository.findOne(
              {
                  relations:{
                      roles: true,
                      student: true,
                      teacher: true,
                  },
                  where: {
                      email: email,
                  }
              });
            if (!user) {
                throw new Error("Not found user");
            }
            const emailVerif = await this.emailVerifyRepository.findOneBy({
                email: email
            });
            if (emailVerif.emailToken === token) {
                const user = await this.userRepository.findOneBy({ email: emailVerif.email });
                if (user) {
                    user.is_valid = true;
                    await this.emailVerifyRepository.delete(emailVerif);
                    await this.userRepository.save(user);
                    return user;
                }
            } else {
                throw new Error("LOGIN.EMAIL_CODE_NOT_VALID");
            }
        } catch (e) {
            throw e;
        }
    }


}

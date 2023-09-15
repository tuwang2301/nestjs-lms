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
import { EmailVerification } from "./emailVerification.entity";
import config from "./config";
import * as dayjs from "dayjs";
import { MailerService } from "@nestjs-modules/mailer";

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
      @InjectRepository(EmailVerification)
      private emailVerifyRepository: Repository<EmailVerification>,
      private mailerService : MailerService
    ) {
    }

    async findByUsername(username: string) {
        console.time('time_start')

        const result = await this.userRepository
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roles", "roles")
          .leftJoinAndSelect("user.teacher", "teacher")
          .leftJoinAndSelect("user.student", "student")
          .where("user.username = :username", { username })
          .getOne();
        console.timeEnd('time_start');

        return result;
    }

    async findByEmail(email: string) {
        return await this.userRepository
          .createQueryBuilder("user")
          .leftJoinAndSelect("user.roles", "roles")
          .leftJoinAndSelect("user.teacher", "teacher")
          .leftJoinAndSelect("user.student", "student")
          .where("user.email = :email", { email })
          .getOne();

        // return await this.userRepository.findOne({
        //     relations: {
        //         roles: true,
        //         student: true,
        //         teacher: true
        //     },
        //     where: {
        //         email: email
        //     }
        // })
    }

    async findEmailVerification(email: string) {
        return await this.emailVerifyRepository
          .createQueryBuilder("email_verification")
          .where("email_verification.email = :email", { email })
          .getOne();
        // return await this.emailVerifyRepository.findOne({
        //     where: {
        //         email: email
        //     }
        // })
    }


    async signIn(username: string, pass: string) {
        try {
            let user = await this.findByUsername(username) ?
              await this.findByUsername(username): await this.findByEmail(username);
            if (!user) {
                throw new Error("Not found user by username/email");
            }

            if(!user.is_valid){
                throw new Error("Email of user not verified");
            }

            const checkPass = await compare(pass, user.password);
            if (!checkPass) {
                throw new Error("Sign in fail, Check again username and password");
            }
            const payload = {
                id: user.id,
                username: user.username,
                roles: user.roles.map(role => role.authority)
            };
            return {
                user,
                access_token: await this.jwtService.signAsync(
                  payload,
                  {
                      expiresIn: '45m',
                  }
                )
            };
        } catch (e) {
            throw e;
        }
    }

    async signUpStudent(data: SignupDto) {
        try {
            const check1 = await this.findByUsername(data.username);
            if (check1) {
                throw new Error("Username already exist");
            }
            const check2 = await this.findByEmail(data.email);
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
            const check1 = await this.findByUsername(data.username);
            if (check1) {
                throw new Error("Username already exist");
            }
            const check2 = await this.findByEmail(data.email);
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

    async createEmailVerification(email: string) {
        const newEmail = new EmailVerification();
        newEmail.email = email;
        newEmail.emailToken = await this.generateToken();
        newEmail.timestamp = new Date();
        return newEmail;
    }

    async generateToken() {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }

    async createEmailToken(email: string) {
        const emailVerification
          = await this.emailVerifyRepository
          .createQueryBuilder("email_verification")
          .where("email_verification.email = :email", { email })
          .getOne();
        if (!emailVerification) {
            const newEmail = await this.createEmailVerification(email);
            return await this.emailVerifyRepository.save(newEmail);
            // } else if (
            //   emailVerification &&
            //   (dayjs().diff(dayjs(emailVerification.timestamp.toString()), "minutes", true)) < 15
            // ) {
            //     throw new Error("LOGIN.EMAIL_SENT_RECENTLY");
        } else {
            emailVerification.emailToken = await this.generateToken();
            emailVerification.timestamp = new Date();
            return await this.emailVerifyRepository.save(emailVerification);
        }
    }

    async createTransporter() {
        return nodemailer.createTransport({
            service: config.mail.service,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    }

    async createMailOptions(email: string, emailToken: string) {
        return {
            from:"quangtu2301@gmail.com",
            to: email, // list of receivers (separated by ,)
            subject: "Verify Email",
            text: "Verify Email",
            html: "Hi! Thanks for your registration" +
              "<p>Here is your token <b>" + emailToken + "</b>"
            // '<a href=' + config.host.url + ':' + config.host.port + "/auth/verify/" + model.emailToken + "\">Click here to activate your account</a>"  // html body
        };
    }

    async sendEmailVerification(email: string) {
        try {
            const model
              = await this.emailVerifyRepository
              .createQueryBuilder("email_verification")
              .where("email_verification.email = :email", { email })
              .getOne();

            if (model && model.emailToken) {
                // const transporter = await this.createTransporter();
                const mailOptions = await this.createMailOptions(email, model.emailToken);
                let sent
                = await this.mailerService.sendMail(mailOptions)
                  .then(() => true)
                  .catch((error) => {
                      console.log(error.message);
                      return false;
                  })
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
                  relations: {
                      roles: true,
                      student: true,
                      teacher: true
                  },
                  where: {
                      email: email
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

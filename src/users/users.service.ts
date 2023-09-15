import { Injectable } from '@nestjs/common';
import { UsersDTO } from './dto/users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { AssignRoleDto } from './dto/assignRole.dto';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService
  ) {}
  async getListUser() {
    return await this.usersRepository.find();
  }

  async getUserByToken(authorization: string){
    const token = authorization.replace('Bearer','').trim();
    const decode = this.jwtService.decode(token);
    return this.usersRepository.findOne({
      relations:
        {
          student: true,
          teacher: true,
        },
      where:
        {
          id: decode['id']
        }
    });
  }

  async createUser(data: UsersDTO) {
    try {
      const check = await this.usersRepository.findOneBy({
        username: data.username,
      });
      if (check != null) {
        throw new Error(`User name '${data.username}' already exist`);
      }
      const user = new Users();
      user.parseUsers(data);
      return await this.usersRepository.save(user);
    } catch (e) {
      throw new Error('Error when creating: ' + e.message);
    }
  }

  async deleteUser(username: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { username: username },
      });
      if (!user) {
        throw new Error('Not found user');
      }
      return await this.usersRepository.remove(user);
    } catch (error) {
      throw new Error('Error when deleting: ' + error.message);
    }
  }

  async updateUser(id: number, userdto: UsersDTO) {
    try {
      const result = await this.usersRepository.update(id, userdto);
      return result;
    } catch (error) {
      throw new error();
    }
  }

  async getUserProfile(id: number) {
    try {
      const result = await this.usersRepository.findOne({
        relations: {
          roles: true,
          student: true,
          teacher: true,
        },
        where: {
          id: id,
        },
      });
      if (result === null || result === undefined) {
        throw new Error('Not found this user');
      }
      return result
    } catch (error) {
      throw error;
    }
  }

  async assignRole(assignDTO: AssignRoleDto) {
    try {
      const user = await this.usersRepository.findOne({
        relations: {
          roles: true,
        },
        where: {
          id: assignDTO.user_id,
        },
      });
      if (user === null) {
        throw new Error('User not found');
      }
      const role = await this.roleRepository.findOneById(assignDTO.role_id);
      if (role === null) {
        throw new Error('Role not found');
      }
      if (!user.roles) {
        user.roles = [];
        user.roles.push(role);
      } else {
        user.roles.push(role);
      }
      return this.usersRepository.save(user);
    } catch (e) {
      throw e;
    }
  }

  async findOne(username: string) {
    const user = await this.usersRepository.findOne({
      relations: { roles: true },
      where: { username: username },
    });
    if (!user) {
      throw new Error('Not found user');
    }
    return user;
  }
}

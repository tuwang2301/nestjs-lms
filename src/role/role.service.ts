import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { RoleDTO } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getRoles() {
    try {
      return this.roleRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async addRole(roleDTO: RoleDTO) {
    try {
      const found = await this.roleRepository.findOneBy({
        authority: roleDTO.authority,
      });
      if (found !== null && found !== undefined) {
        throw new Error('This authority already exist');
      }
      return this.roleRepository.save(roleDTO);
    } catch (e) {
      throw e;
    }
  }
}

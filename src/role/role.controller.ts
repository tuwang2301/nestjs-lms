import { Body, Controller, Get, Post, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseObject } from "../common/ResponseObject";
import { RoleService } from "./role.service";
import { RoleDTO } from "./role.dto";
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @Authorities(Authority.Admin)
  async getRoles() {
    try {
      const result = await this.roleService.getRoles();
      return new ResponseObject(true, `All roles`, result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  @Authorities(Authority.Admin)
  async createRole(@Body(new ValidationPipe()) roleDTO: RoleDTO) {
    try {
      const result = await this.roleService.addRole(roleDTO);
      return new ResponseObject(true, `Add successfull`, result);
    } catch (error) {
      return new ResponseObject(false, 'Add fail', error.message);
    }
  }
}

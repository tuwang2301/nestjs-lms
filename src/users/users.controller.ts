import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersDTO } from "./dto/users.dto";
import { ResponseObject } from "../common/ResponseObject";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AssignRoleDto } from "./dto/assignRole.dto";
import { Authorities } from "../auth/authorities.decorator";
import { Authority } from "../common/globalEnum";

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @Authorities(Authority.Admin)
  async getListUsers() {
    try {
      const result = await this.usersService.getListUser();
      return new ResponseObject(true, 'All users', result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Get('user-profile/:id')
  @ApiOperation({ summary: 'Get user profile' })
  async getUserProfile(@Param('id') id: number) {
    try {
      const result = await this.usersService.getUserProfile(id);
      return new ResponseObject(true, `User by id = ${id} found`, result);
    } catch (error) {
      return new ResponseObject(false, 'Error', error.message);
    }
  }

  @Put('assign-role/')
  @ApiOperation({ summary: 'Assign role' })
  @Authorities(Authority.Admin, Authority.Teacher)
  async assignRole(@Body() assignDTO: AssignRoleDto) {
    try {
      const result = await this.usersService.assignRole(assignDTO);
      return new ResponseObject(true, `Assign successfully`, result);
    } catch (error) {
      return new ResponseObject(false, 'Assign fail', error.message);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create new user' })
  @Authorities(Authority.Admin)
  async create(@Body() data: UsersDTO) {
    try {
      const result = await this.usersService.createUser(data);
      return new ResponseObject(true, 'Add successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Add fail', error.message);
    }
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete user by username' })
  @Authorities(Authority.Admin)
  async delete(@Body() username: string) {
    try {
      const result = await this.usersService.deleteUser(username);
      return new ResponseObject(true, 'Delete successfully', result);
    } catch (error) {
      return new ResponseObject(false, 'Delete fail', error.message);
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @Authorities(Authority.Admin)
  async update(@Param('id') id: number, @Body() userdto: UsersDTO) {
    try {
      const result = this.usersService.updateUser(id, userdto);
      return new ResponseObject(true, 'Update successfully', result);
    } catch (e) {
      return new ResponseObject(false, 'Update fail', e.message);
    }
  }
}

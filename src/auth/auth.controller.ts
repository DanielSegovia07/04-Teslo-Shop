import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';

import { from } from 'rxjs';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { get, IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User

  ){
    return this.authService.checkAuthStatus(user )
  } 

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request : Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail : string,
    @RawHeaders() rawHeaders:string[],
    @Headers() Headers: IncomingHttpHeaders
  ){
    
 
    return {
      ok : true,
      message : 'Hola mundo private',
      user,
      userEmail,
      rawHeaders,
      Headers
    }
  }

  @Get('private2')
  // @SetMetadata('roles',['admin','super-user'])
  @RoleProtected( ValidRoles.SuperUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){
    return{
      ok : true,
      user
    }
  }

  @Get('private3')
  // @SetMetadata('roles',['admin','super-user'])
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User
  ){
    return{
      ok : true,
      user
    }
  }
  

}

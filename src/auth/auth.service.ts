import { BadRequestException, Delete, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    private readonly jwtService :  JwtService,
    private readonly configService: ConfigService,
    
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
  
      // Crear el usuario con el password cifrado
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
  
      // Guardar el usuario en la base de datos
      await this.userRepository.save(user);
  
      // Crear una copia del usuario sin la propiedad 'password'
      const { password: _, ...userWithoutPassword } = user;
  
      // Devolver el usuario sin la propiedad 'password'
      return {
        ...userWithoutPassword,
        token: this.getJwtToken({id:userWithoutPassword.id})
      }
      
    } catch (error) {
      this.handleDBErrors(error);
    }
  }
  
  async login(loginUserDto:LoginUserDto){
    
    const {password, email} = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email},
      select:{email:true, password:true, id: true}
    })

    if(!user)
      throw new UnauthorizedException('Credentials are not valid (email)')
    if(!bcrypt.compareSync(password,user.password))
      throw new UnauthorizedException('Credentials are not valid (password)')

    console.log(user)
    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    }

  }

  checkAuthStatus(user : User){
    
    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    }
  }

  private getJwtToken(payload:JwtPayload){
    
    const secret = this.configService.get('JWT_SECRET');
    const token =  this.jwtService.sign( payload ,{secret})
    return token;

  }

  private handleDBErrors(error: any){
    if( error.code === '23505')
      throw new BadRequestException( error.detail)

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }

}

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";



export class JwtStrategy extends PassportStrategy( Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){
        const secret = configService.get('JWT_SECRET') || 'default_secret';
    console.log('JWT_SECRET:', secret);  // Verifica el valor de JWT_SECRET
    
        super({
            secretOrKey: configService.get('JWT_SECRET') || 'default', // Usa un valor por defecto
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          });
          
    }

    async validate(payload: JwtPayload): Promise<User> {

        const {id} = payload

        const user = await this.userRepository.findOneBy({id})
        if(!user)
            throw new UnauthorizedException('token not valid')
    
        if(!user.isActive)
            throw new UnauthorizedException('User is inactive')

        
        return user 
        
        
    }

    
}
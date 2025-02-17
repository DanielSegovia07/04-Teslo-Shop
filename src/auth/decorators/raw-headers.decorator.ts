import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { User } from '../entities/user.entity';
import { use } from "passport";


export const RawHeaders = createParamDecorator(
    (data : string, ctx: ExecutionContext) => {
        
    
        const req = ctx.switchToHttp().getRequest()
        return req.rawHeaders;

        

    }
)
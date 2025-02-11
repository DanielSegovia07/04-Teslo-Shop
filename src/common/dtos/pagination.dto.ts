import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto { 

    @IsOptional()
    @IsPositive()
    //transformar
    @Type(() => Number) //enableimplicitConversions: true
    limit?: number;

    @IsOptional()
    @IsPositive()
    @Min(0)
    //transformar
    @Type(() => Number) //enableimplicitConversions: true
    offset?: number; 

}
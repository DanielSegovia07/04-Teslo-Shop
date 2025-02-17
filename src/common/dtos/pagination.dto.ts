import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto { 

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
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
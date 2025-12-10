import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    
    @ApiProperty({ example: 'Solicitud', description: 'Category title' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'General request', description: 'Category description' })
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'open', enum: ['open', 'in_progress', 'closed'], description: 'Category status' })
    @IsNotEmpty()
    @IsIn(['open', 'in_progress', 'closed'])
    status: 'open' | 'in_progress' | 'closed';
}


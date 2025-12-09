import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'The fullname cannot be empty.' })
  @IsString({ message: 'The fullname must be a string' })
  fullname!: string;

  @ApiProperty({ minLength: 8, example: 'MyP@ssw0rd' })
  @IsString({ message: 'The password must be a string' })
  @IsNotEmpty({ message: 'The password cannot be empty.' })
  @MinLength(8, {
    message: 'The password must be at least 8 valid characters.',
  })
  password!: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'The email cannot be empty.' })
  email!: string;
}
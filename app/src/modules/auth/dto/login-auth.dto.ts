import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ example: 'juan@example.com' })
  @IsString({
    message: 'The email address must be a string',
  })
  @IsNotEmpty({ message: 'The email cannot be empty.' })
  email!: string;

  @ApiProperty({ minLength: 8, example: 'MyP@ssw0rd' })
  @IsString({ message: 'The password must be a string' })
  @MinLength(8, {
    message: 'The password must be at least 8 valid characters.',
  })
  @IsNotEmpty({ message: 'The password cannot be empty.' })
  password!: string;
}
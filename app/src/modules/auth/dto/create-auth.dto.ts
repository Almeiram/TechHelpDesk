import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';
import type { UserRole } from '../../users/entities/user.entity';

export class CreateAuthDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'technician', 'client'])
  role?: UserRole;
}

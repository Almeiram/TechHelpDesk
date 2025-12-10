import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ example: 'john@example.com', description: 'User email address' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'StrongP@ssw0rd', description: 'Plain-text password (will be hashed)' })
	@IsNotEmpty()
	password: string;

	@ApiProperty({ example: 'client', enum: ['admin', 'technician', 'client'], description: 'Role assigned to the user', required: false })
	@IsOptional()
	@IsIn(['admin', 'technician', 'client'])
	role?: 'admin' | 'technician' | 'client';
}

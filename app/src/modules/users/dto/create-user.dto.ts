import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	name: string;

	@IsEmail()
	email: string;

	@IsNotEmpty()
	password: string;

	@IsOptional()
	@IsIn(['admin', 'technician', 'client'])
	role?: 'admin' | 'technician' | 'client';
}

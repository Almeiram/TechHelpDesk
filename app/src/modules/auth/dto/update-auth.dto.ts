import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: 'The username must be provided.' })
    @IsString({ message: 'The username must be a string value.' })
    @MinLength(3, { message : 'The username must be at least 3 characters long.' })
    username: string;

    @IsNotEmpty({ message: 'The password must be provided.' })
    @IsString({ message: 'The password must be a string value.' })
    @MinLength(6, { message : 'The password must be at least 6 characters long.' })
    password: string;
}
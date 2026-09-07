import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import type { UserRole } from './user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['Administrator', 'Operator', 'Viewer'])
  @IsOptional()
  role?: UserRole;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['Administrator', 'Operator', 'Viewer'])
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  isActive?: boolean;
}

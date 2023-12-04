import {
  IsNotEmpty,
  MinLength,
  IsString,
  IsEmail,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export default class SignUpDto {
  @ApiProperty({
    required: true,
    type: String,
    minLength: 3,
    maxLength: 128,
    description: 'The user email',
    example: 'user@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(128)
  readonly email: string = '';

  @ApiProperty({
    required: true,
    type: String,
    minLength: 8,
    maxLength: 64,
    description: 'The user password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';

  @ApiProperty({
    required: true,
    enum: [UserRole],
    description: 'The user role',
  })
  @IsEnum(UserRole)
  readonly role: UserRole = UserRole.USER;

  @ApiProperty({
    required: true,
    type: String,
    minLength: 3,
    maxLength: 64,
    description: 'The username',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  readonly username: string = '';

  @ApiProperty({
    required: true,
    type: String,
    minLength: 3,
    maxLength: 80,
    description: 'The user fullName',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  readonly fullName: string = '';
}

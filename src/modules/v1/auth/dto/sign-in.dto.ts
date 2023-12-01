import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class SignInDto {
  constructor(body: SignInDto | null = null) {
    if (body) {
      this.email = body.email;
      this.password = body.password;
    }
  }

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
}

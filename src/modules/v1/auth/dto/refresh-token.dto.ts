import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token',
    required: true,
    minLength: 32,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(32)
  @IsString()
  readonly refreshToken: string = '';
}

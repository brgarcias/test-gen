import { ApiProperty } from '@nestjs/swagger';

export default class JwtTokensDto {
  @ApiProperty({
    description: 'The user id',
    type: Number,
  })
  readonly id: number;

  @ApiProperty({
    description: 'The user email',
    type: String,
  })
  readonly email: string;

  @ApiProperty({
    description: 'The access token for api routes',
    type: String,
  })
  readonly accessToken: string = '';

  @ApiProperty({
    description: 'The refresh token',
    type: String,
  })
  readonly refreshToken: string = '';
}

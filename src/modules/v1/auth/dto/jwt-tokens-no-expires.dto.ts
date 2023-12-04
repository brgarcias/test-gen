import { ApiProperty } from '@nestjs/swagger';

export default class JwtTokensNoExpiresDto {
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

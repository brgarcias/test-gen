import { ApiProperty } from '@nestjs/swagger';

export default class JwtTokensDto {
  @ApiProperty({
    type: Number,
  })
  readonly id: number;

  @ApiProperty({
    type: String,
  })
  readonly email: string;

  @ApiProperty({
    type: String,
  })
  readonly accessToken: string = '';

  @ApiProperty({
    type: String,
  })
  readonly refreshToken: string = '';
}

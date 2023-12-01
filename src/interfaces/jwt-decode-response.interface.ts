import { Roles } from '@decorators/roles.decorator';

export interface JwtDecodeResponse {
  id: number;
  email: string;
  role: typeof Roles;
  iat: number;
  exp: number;
}

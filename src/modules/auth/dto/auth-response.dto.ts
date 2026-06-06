import { Role } from '@prisma/client';

export class AuthResponseDto {
  user!: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };

  accessToken!: string;
  refreshToken!: string;
}

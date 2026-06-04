import { Role } from '@prisma/client';

export interface RequestWithUser {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

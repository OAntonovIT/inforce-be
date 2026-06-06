import { Role } from '@prisma/client';
export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

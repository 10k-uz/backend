import { SetMetadata } from '@nestjs/common';

export const Perms = (roles: string[]) => SetMetadata('perms', roles);

import { SetMetadata } from '@nestjs/common';
// configs
import { Role } from 'src/enums';
import { ROLES_KEY } from 'src/constants';

export const RolesDecorator = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);

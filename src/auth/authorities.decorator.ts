import { SetMetadata } from '@nestjs/common';
import { Authority } from '../common/globalEnum';

export const AUTHORITY_KEY = 'authorities';
export const Authorities = (...authorities: Authority[]) =>
  SetMetadata(AUTHORITY_KEY, authorities);

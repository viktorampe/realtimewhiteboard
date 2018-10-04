import { PersonInterface } from './Person.interface';

export interface PassportUserIdentityInterface {
  profile: any;
  provider?: string;
  authScheme?: string;
  externalId?: string;
  credentials?: any;
  created?: Date;
  modified?: Date;
  id?: number;
  userId?: number;
  user?: PersonInterface;
}

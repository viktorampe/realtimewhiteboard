import { PersonInterface } from './Person.interface';

export interface PassportUserCredentialInterface {
  useAvatar?: boolean;
  profile: any;
  provider?: string;
  authScheme?: string;
  externalId?: string;
  created?: Date;
  modified?: Date;
  id?: number;
  userId?: number;
  user?: PersonInterface;
  providerLogo?: string;
}

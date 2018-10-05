import { PersonInterface } from './Person.interface';

export interface AccessTokenInterface {
  id?: string;
  ttl?: number;
  scopes?: ['string'];
  created?: Date;
  userId?: string;
  user?: PersonInterface;
}

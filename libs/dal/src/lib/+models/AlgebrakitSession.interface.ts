import { PersonInterface } from './Person.interface';

export interface AlgebrakitSessionInterface {
  sessionId: string;
  id?: number;
  userId?: number;
  user?: PersonInterface;
}

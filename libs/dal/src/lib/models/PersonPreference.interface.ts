import { PersonInterface } from './Person.interface';

export interface PersonPreferenceInterface {
  key: string;
  value: any;
  id?: number;
  personId?: number;
  person?: PersonInterface;
}

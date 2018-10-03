import { PersonInterface } from './Person.interface';

export interface PersonToggleFeatureInterface {
  key: string;
  value: string;
  id?: number;
  personId?: number;
  person?: PersonInterface;
}

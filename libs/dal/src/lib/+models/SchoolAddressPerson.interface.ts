import { PersonInterface } from './Person.interface';
import { SchoolAddressInterface } from './SchoolAddress.interface';

export interface SchoolAddressPersonInterface {
  id?: number;
  schoolAddressId?: number;
  personId?: number;
  schoolAddress?: SchoolAddressInterface;
  person?: PersonInterface;
}

import { EduNetInterface } from './EduNet.interface';
import { GroupInterface } from './Group.interface';
import { PersonInterface } from './Person.interface';
import { SchoolInterface } from './School.interface';

export interface SchoolAddressInterface {
  name: string;
  street: string;
  houseNumber?: string;
  zip: string;
  place: string;
  atlasReference?: string;
  id?: number;
  eduNetId?: number;
  schools?: SchoolInterface[];
  persons?: PersonInterface[];
  groups?: GroupInterface[];
  eduNet?: EduNetInterface;
}

import { EduNetInterface } from './EduNet.interface';
import { PersonInterface } from './Person.interface';
import { SchoolAddressInterface } from './SchoolAddress.interface';

export interface SchoolInterface {
  establishmentNumber?: number;
  schoolNumber?: number;
  headquarters?: boolean;
  name: string;
  street: string;
  houseNumber?: string;
  zip: string;
  place: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  contactFirstName?: string;
  contactLastName?: string;
  country: string;
  atlasReference?: string;
  origin?: string;
  id?: number;
  personId?: number;
  schoolAddressId?: number;
  eduNetId?: number;
  person?: PersonInterface;
  schoolAddress?: SchoolAddressInterface;
  eduNet?: EduNetInterface;
}

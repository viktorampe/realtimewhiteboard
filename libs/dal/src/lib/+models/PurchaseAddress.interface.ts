import { PersonInterface } from './Person.interface';

export interface PurchaseAddressInterface {
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  houseNumberAddition?: string;
  place: string;
  zip: string;
  country: string;
  email: string;
  companyName?: string;
  vat?: string;
  id?: number;
  personId?: number;
  person?: PersonInterface;
}

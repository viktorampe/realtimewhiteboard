import { PersonInterface } from './Person.interface';

export interface ContactformEntryInterface {
  name: string;
  schoolName?: string;
  email: string;
  phone?: string;
  captcha: string;
  subject: string;
  message: string;
  id?: number;
  personId?: number;
  person?: PersonInterface;
}

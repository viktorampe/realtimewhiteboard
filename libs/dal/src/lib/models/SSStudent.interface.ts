import { PassportUserCredentialInterface } from './PassportUserCredential.interface';
import { SSSchoolInterface } from './SSSchool.interface';

export interface SSStudentInterface {
  batchIdentifier: string;
  objectNr?: number;
  userIdentifier: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: Date;
  email?: string;
  id?: number;
  schoolIdentifier?: string;
  passportUserCredential?: PassportUserCredentialInterface;
  school?: SSSchoolInterface;
}

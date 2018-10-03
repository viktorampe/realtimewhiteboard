import { PassportUserCredentialInterface } from './PassportUserCredential.interface';
import { SSSchoolInterface } from './SSSchool.interface';

export interface SSCoaccountInterface {
  batchIdentifier: string;
  objectNr?: number;
  batchStartTime?: number;
  userIdentifier: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: Date;
  email?: string;
  id?: number;
  mainAccountReference?: string;
  schoolIdentifier?: string;
  passportUserCredential?: PassportUserCredentialInterface;
  mainAccount?: PassportUserCredentialInterface;
  school?: SSSchoolInterface;
}

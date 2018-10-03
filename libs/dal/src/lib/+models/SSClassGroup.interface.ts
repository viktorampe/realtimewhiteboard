import { GroupInterface } from './Group.interface';
import { SSClassGroupStudentInterface } from './SSClassGroupStudent.interface';
import { SSClassGroupTeacherInterface } from './SSClassGroupTeacher.interface';
import { SSSchoolInterface } from './SSSchool.interface';

export interface SSClassGroupInterface {
  batchIdentifier: string;
  objectNr?: number;
  instituteNumber?: string;
  classIdentifier: string;
  isOfficial?: boolean;
  name?: string;
  administrativeCode?: string;
  schoolIdentifier?: string;
  groups?: GroupInterface[];
  school?: SSSchoolInterface;
  students?: SSClassGroupStudentInterface[];
  teachers?: SSClassGroupTeacherInterface[];
}

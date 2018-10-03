import { SSClassGroupInterface } from './SSClassGroup.interface';
import { SSClassGroupTeacherInterface } from './SSClassGroupTeacher.interface';
import { SSSchoolInterface } from './SSSchool.interface';
import { SSStudentInterface } from './SSStudent.interface';
import { SSTeacherInterface } from './SSTeacher.interface';

export interface SSBatchesInterface {
  batchIdentifier: string;
  batchStartTime?: number;
  totalObjects?: number;
  objectsImported?: number;
  fullBatch?: boolean;
  processed?: Date;
  processedResult?: string;
  classGroups?: SSClassGroupInterface[];
  schools?: SSSchoolInterface[];
  students?: SSStudentInterface[];
  teachers?: SSTeacherInterface[];
  classGroupsTeacher?: SSClassGroupTeacherInterface[];
}

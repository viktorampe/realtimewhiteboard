import { StudentContentStatusInterface } from './StudentContentStatus.interface';

export interface ContentStatusInterface {
  label: string;
  id?: number;
  studentContentStatuses?: StudentContentStatusInterface[];
}

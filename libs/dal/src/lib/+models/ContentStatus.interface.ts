import { StudentContentStatusInterface } from './StudentContentStatus.interface';

export enum ContentStatusLabel {
  NEW = 'Nieuw',
  PENDING = 'Gestart',
  FINISHED = 'Klaar'
}

export interface ContentStatusInterface {
  label: ContentStatusLabel | string;
  id?: number;
  studentContentStatuses?: StudentContentStatusInterface[];
}

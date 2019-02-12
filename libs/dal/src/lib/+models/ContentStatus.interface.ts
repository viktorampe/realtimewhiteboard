import { StudentContentStatusInterface } from './StudentContentStatus.interface';

export enum ContentStatusLabel {
  NEW = 'Nieuw',
  PENDING = 'Gestart',
  FINISHED = 'Klaar'
}

export interface ContentStatusInterface {
  label: ContentStatusLabel;
  id?: number;
  studentContentStatuses?: StudentContentStatusInterface[];
}

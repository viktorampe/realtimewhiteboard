import {
  ClassGroupInterface,
  EduContentBookInterface,
  EduContentTOCInterface
} from '.';

export interface UnlockedFreePracticeInterface {
  id?: number;
  eduContentBookId?: number;
  eduContentTOCId?: number;
  classGroupId: number;
  eduContentBook?: EduContentBookInterface;
  eduContentTOC?: EduContentTOCInterface;
  classGroup?: ClassGroupInterface;
}

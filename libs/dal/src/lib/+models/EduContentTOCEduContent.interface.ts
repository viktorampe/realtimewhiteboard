import { EduContentInterface } from './EduContent.interface';
import { EduContentTOCInterface } from './EduContentTOC.interface';

export interface EduContentTOCEduContentInterface {
  id?: string; // eduContentTOCId +'-'+ eduContentId
  eduContentTOCId: number;
  eduContentTOC?: EduContentTOCInterface;
  eduContentId: number;
  eduContent?: EduContentInterface;
  // TODO replace by ENUM
  type: string;
}

import { EduContentInterface, EDU_CONTENT_TYPE } from './EduContent.interface';
import { EduContentTOCInterface } from './EduContentTOC.interface';

export interface EduContentTOCEduContentInterface {
  id?: string; // eduContentTOCId +'-'+ eduContentId
  eduContentTOCId: number;
  eduContentTOC?: EduContentTOCInterface;
  eduContentId: number;
  eduContent?: EduContentInterface;
  // TODO replace by ENUM
  type: EDU_CONTENT_TYPE;
}

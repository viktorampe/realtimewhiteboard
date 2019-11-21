import {
  EduContentInterface,
  EduContentTypeEnum
} from './EduContent.interface';
import { EduContentTOCInterface } from './EduContentTOC.interface';

export interface EduContentTOCEduContentInterface {
  id?: string; // eduContentTOCId +'-'+ eduContentId
  eduContentTOCId: number;
  eduContentTOC?: EduContentTOCInterface;
  eduContentId: number;
  eduContent?: EduContentInterface;
  type: EduContentTypeEnum;
}

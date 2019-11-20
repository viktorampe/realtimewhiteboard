import { EduContentInterface } from './EduContent.interface';
import { EduContentTOCInterface } from './EduContentTOC.interface';

export interface EduContentTOCEduContentInterface {
  id?: number;
  eduContentTOCId?: number;
  eduContentTOC?: EduContentTOCInterface;
  eduContentId?: number;
  eduContent?: EduContentInterface[];
}

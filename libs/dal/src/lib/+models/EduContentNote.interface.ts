import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';

export interface EduContentNoteInterface {
  text: string;
  created: Date;
  id?: number;
  eduContentId?: number;
  personId?: number;
  eduContent?: EduContentInterface;
  person?: PersonInterface;
}

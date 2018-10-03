import { EduContentInterface } from './EduContent.interface';
import { PersonInterface } from './Person.interface';

export interface EduContentLogInterface {
  updated?: Date;
  id?: number;
  eduContentId?: number;
  personId?: number;
  eduContent?: EduContentInterface;
  person?: PersonInterface;
}

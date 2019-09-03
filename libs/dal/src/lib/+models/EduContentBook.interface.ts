import { EduContentTOCInterface } from './EduContentTOC.interface';
import { MethodInterface } from './Method.interface';
import { YearInterface } from './Year.interface';

export interface EduContentBookInterface {
  title: string;
  ISBN?: string;
  id?: number;
  methodId?: number;
  years?: YearInterface[];
  method?: MethodInterface;
  eduContentTOC?: EduContentTOCInterface[];
  diabolo?: boolean;
}

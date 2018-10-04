import { FaqCategoryInterface } from './FaqCategory.interface';
import { FaqCategoryFaqInterface } from './FaqCategoryFaq.interface';
import { PersonInterface } from './Person.interface';

export interface FaqInterface {
  question: string;
  draftQuestion?: string;
  answer: string;
  draftAnswer?: string;
  slug: string;
  created?: Date;
  updated?: Date;
  published?: Date;
  forTeachers?: boolean;
  forStudents?: boolean;
  id?: number;
  editorId?: number;
  editor?: PersonInterface;
  faqOrder?: FaqCategoryFaqInterface[];
  categories?: FaqCategoryInterface[];
}

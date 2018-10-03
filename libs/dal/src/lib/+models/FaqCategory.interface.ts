import { FaqInterface } from './Faq.interface';
import { FaqCategoryFaqInterface } from './FaqCategoryFaq.interface';
import { PersonInterface } from './Person.interface';

export interface FaqCategoryInterface {
  name: string;
  slug: string;
  icon: string;
  created?: Date;
  updated?: Date;
  published?: Date;
  forTeachers?: boolean;
  forStudents?: boolean;
  teacherOrder?: number;
  studentOrder?: number;
  id?: number;
  editorId?: number;
  questions?: FaqInterface[];
  editor?: PersonInterface;
  faqOrder?: FaqCategoryFaqInterface[];
}

import { FaqInterface } from './Faq.interface';
import { FaqCategoryInterface } from './FaqCategory.interface';

export interface FaqCategoryFaqInterface {
  studentOrder?: number;
  teacherOrder?: number;
  id?: number;
  faqId?: number;
  faqCategoryId?: number;
  question?: FaqInterface;
  categories?: FaqCategoryInterface;
}

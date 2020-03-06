import { PersonInterface } from '@campus/dal';
import { StudentTaskContentInterface } from './StudentTaskContent.interface';

export interface StudentTaskWithContentInterface {
  name: string;
  description: string;
  learningAreaName: string;
  startDate: Date;
  endDate: Date;
  assigner: PersonInterface;
  contents: StudentTaskContentInterface[];
}

import { PersonInterface } from '@campus/dal';
import { StudentTaskContentInterface } from './StudentTaskContent.interface';

export interface StudentTaskWithContentInterface {
  name: string;
  description: string;
  learningAreaName: string;
  start: Date;
  end: Date;
  assigner: PersonInterface;
  contents: StudentTaskContentInterface[];
}

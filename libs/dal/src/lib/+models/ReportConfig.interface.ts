import { PersonInterface } from './Person.interface';

export interface ReportConfigInterface {
  description: string;
  config?: string;
  chart?: string;
  public?: boolean;
  id?: number;
  personId?: number;
  user?: PersonInterface;
}

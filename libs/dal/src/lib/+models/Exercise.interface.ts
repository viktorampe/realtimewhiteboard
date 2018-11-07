import { EduContentInterface, ResultInterface } from '@campus/dal';
export interface ExerciseInterface {
  eduContent: EduContentInterface;
  cmiMode: string; //?
  result: ResultInterface;
  saveToApi: boolean;
  url: string;
}

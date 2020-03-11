import { ResultStatus } from '@campus/dal';
import { ContentActionInterface } from '@campus/shared';

export interface StudentTaskContentInterface {
  required: boolean;
  name: string;
  description: string;
  icon: string;
  status: ResultStatus;
  lastUpdated: Date;
  score: number;
  eduContentId: number;
  actions: ContentActionInterface[];
}

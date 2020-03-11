import { ContentActionInterface } from '@campus/shared';

export interface StudentTaskContentInterface {
  required: boolean;
  name: string;
  description: string;
  icon: string;
  status: string;
  lastUpdated: Date;
  score: number;
  eduContentId: number;
  actions: ContentActionInterface[];
  index: number;
}

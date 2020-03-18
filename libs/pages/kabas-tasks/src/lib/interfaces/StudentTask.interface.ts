import { TaskInterface } from '@campus/dal';
import { ContentActionInterface } from '@campus/shared';
export interface StudentTaskInterface {
  task: TaskInterface;
  name: string;
  description: string;
  learningAreaName: string;
  learningAreaId: number; //use as anchor
  count: {
    completedRequired: number;
    totalRequired: number;
  };
  isFinished: boolean;
  isUrgent: boolean;
  dateGroupLabel: string;
  dateLabel: string;
  endDate: Date;
  actions: ContentActionInterface[];
}

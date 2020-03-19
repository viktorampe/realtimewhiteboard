import { TaskActionInterface } from '@campus/shared';

export interface StudentTaskInterface {
  taskInstanceId: number;
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
  actions: TaskActionInterface[];
}

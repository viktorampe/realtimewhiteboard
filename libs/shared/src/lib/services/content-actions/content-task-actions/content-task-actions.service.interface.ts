import { InjectionToken } from '@angular/core';
import { EduContent } from '@campus/dal';
import { ContentActionInterface } from '../..';

export interface ContentTaskManagerInterface {
  addEduContentToTask(eduContent: EduContent): void;
  removeEduContentFromTask(eduContent: EduContent): void;
}

export const CONTENT_TASK_ACTIONS_SERVICE_TOKEN = new InjectionToken(
  'ContentTaskActionsService'
);

export const CONTENT_TASK_MANAGER_TOKEN = new InjectionToken<
  ContentTaskManagerInterface
>('ContentTaskManager');

export interface ContentTaskActionsServiceInterface {
  contentTaskActionDictionary: { [key: string]: ContentActionInterface };
  getTaskActionsForEduContent(
    eduContent: EduContent,
    inTask: boolean
  ): ContentActionInterface[];
}

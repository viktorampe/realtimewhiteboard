import { forwardRef, Inject, Injectable } from '@angular/core';
import { EduContent } from '@campus/dal';
import { ContentActionInterface } from '../..';
import {
  ContentTaskActionsServiceInterface,
  ContentTaskManagerInterface,
  CONTENT_TASK_MANAGER_TOKEN
} from './content-task-actions.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentTaskActionsService
  implements ContentTaskActionsServiceInterface {
  constructor(
    @Inject(forwardRef(() => CONTENT_TASK_MANAGER_TOKEN))
    private contentTaskManager: ContentTaskManagerInterface
  ) {}

  public contentTaskActionDictionary: {
    [key: string]: ContentActionInterface;
  } = {
    addToTask: {
      label: 'Toevoegen aan taak',
      icon: 'add',
      tooltip: 'Toevoegen aan taak',
      handler: this.contentTaskManager.addEduContentToTask.bind(
        this.contentTaskManager
      )
    },
    removeFromTask: {
      label: 'Verwijderen uit taak',
      icon: 'delete',
      tooltip: 'Verwijderen uit taak',
      handler: this.contentTaskManager.removeEduContentFromTask.bind(
        this.contentTaskManager
      )
    }
  };

  public getTaskActionsForEduContent(
    eduContent: EduContent,
    inTask: boolean
  ): ContentActionInterface[] {
    if (!eduContent.publishedEduContentMetadata.taskAllowed) {
      return [];
    }

    if (inTask) {
      return [this.contentTaskActionDictionary.removeFromTask];
    } else {
      return [this.contentTaskActionDictionary.addToTask];
    }
  }
}

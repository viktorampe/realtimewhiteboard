import { InjectionToken } from '@angular/core';
import { ContentInterface, EduContentInterface } from '@campus/dal';

export const EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN = new InjectionToken(
  'EduContentCollectionManagerService'
);

export interface EduContentCollectionManagerServiceInterface {
  manageBundlesForContent(
    content: ContentInterface,
    learningAreaId?: number
  ): void;

  manageTasksForContent(content: EduContentInterface): void;
}

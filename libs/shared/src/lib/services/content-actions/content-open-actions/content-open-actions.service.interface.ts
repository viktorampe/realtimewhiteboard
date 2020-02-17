import { InjectionToken } from '@angular/core';
import { EduContent } from '@campus/dal';
import { ContentActionInterface } from '@campus/shared';

export interface ContentOpenerInterface {
  openEduContentAsExercise(eduContent: EduContent): void;
  openEduContentAsSolution(eduContent: EduContent): void;
  openEduContentAsStream(eduContent: EduContent): void;
  openEduContentAsDownload(eduContent: EduContent): void;
  openBoeke(eduContent: EduContent): void;
  previewEduContentAsImage(eduContent: EduContent): void;
}

export const CONTENT_OPEN_ACTIONS_SERVICE_TOKEN = new InjectionToken(
  'ContentOpenActionsService'
);

export const CONTENT_OPENER_TOKEN = new InjectionToken<ContentOpenerInterface>(
  'ContentOpener'
);

export interface ContentOpenActionsServiceInterface {
  contentActionDictionary: { [key: string]: ContentActionInterface };
  getActionsForEduContent(eduContent: EduContent): ContentActionInterface[];
}

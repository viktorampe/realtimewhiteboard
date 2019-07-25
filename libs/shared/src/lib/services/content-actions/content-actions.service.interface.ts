import { InjectionToken } from '@angular/core';
import { EduContent } from '@campus/dal';

export interface ContentActionInterface {
  label: string;
  icon: string;
  tooltip: string;
  handler(eduContent: EduContent): void;
}

export interface ContentOpenerInterface {
  openEduContentAsExercise(eduContent: EduContent): void;
  openEduContentAsSolution(eduContent: EduContent): void;
  openEduContentAsStream(eduContent: EduContent): void;
  openEduContentAsDownload(eduContent: EduContent): void;
  openBoeke(eduContent: EduContent): void;
}

export enum EduContentTypeEnum {
  BOEKE = 'boek-e',
  LINK = 'link',
  EXERCISE = 'exercise',
  FILE = 'file',
  PAPER_EXERCISE = 'paper exercise'
}

export const CONTENT_ACTIONS_SERVICE_TOKEN = new InjectionToken(
  'ContentActionsService'
);

export const CONTENT_OPENER_TOKEN = new InjectionToken<ContentOpenerInterface>(
  'ContentOpener'
);

export interface ContentActionsServiceInterface {
  getActionsForEduContent(eduContent: EduContent): ContentActionInterface[];
}

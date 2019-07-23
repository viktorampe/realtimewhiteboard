import { InjectionToken } from '@angular/core';
import { EduContent } from '@campus/dal';
import {
  ContentActionInterface,
  ContentOpenerInterface
} from './content-actions.service';

export const CONTENT_ACTIONS_SERVICE_TOKEN = new InjectionToken(
  'ContentActionsService'
);

export const CONTENT_OPENER_TOKEN = new InjectionToken<ContentOpenerInterface>(
  'ContentOpener'
);

export interface ContentActionsServiceInterface {
  getActionsForEduContent(eduContent: EduContent): ContentActionInterface[];
}

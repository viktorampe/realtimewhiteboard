import { Injectable } from '@angular/core';
import { EduContent } from '@campus/dal';
import { EduContentSearchResultItemServiceInterface } from './edu-content-search-result.service.interface';

export interface SearchResultActionInterface {
  actionType: 'open';
  label: string;
  icon: string;
  tooltip: string;
  handler: string;
}

enum EduContentTypeEnum {
  BOEKE = 'boek-e',
  LINK = 'link',
  EXERCISE = 'exercise',
  FILE = 'file',
  PAPER_EXERCISE = 'paper exercise'
}

export const searchResultActionDictionary: {
  [key: string]: SearchResultActionInterface;
} = {
  openEduContentAsExercise: {
    actionType: 'open',
    label: 'Openen',
    icon: 'exercise:open',
    tooltip: 'Open oefening zonder oplossingen',
    handler: 'openEduContentAsExercise'
  },

  openEduContentAsSolution: {
    actionType: 'open',
    label: 'Toon oplossing',
    icon: 'exercise:finished',
    tooltip: 'Open oefening met oplossingen',
    handler: 'openEduContentAsSolution'
  },

  openEduContentAsStream: {
    actionType: 'open',
    label: 'Openen',
    icon: 'lesmateriaal',
    tooltip: 'Open het lesmateriaal',
    handler: 'openEduContentAsStream'
  },

  openEduContentAsDownload: {
    actionType: 'open',
    label: 'Downloaden',
    icon: 'download',
    tooltip: 'Download het lesmateriaal',
    handler: 'openEduContentAsDownload'
  }
};

@Injectable({
  providedIn: 'root'
})
export class EduContentSearchResultItemService
  implements EduContentSearchResultItemServiceInterface {
  constructor() {}

  /**
   * Gets all actions for the provided eduContent
   *
   * @param {EduContent} eduContent
   * @returns {SearchResultActionInterface[]}
   * @memberof EduContentSearchResultItemService
   */
  getActionsForEduContent(
    eduContent: EduContent
  ): SearchResultActionInterface[] {
    // search result = EduContent + EduContentMetaData relation
    return this.getEduContentActions(eduContent);
  }

  private getEduContentActions(
    eduContent: EduContent
  ): SearchResultActionInterface[] {
    switch (eduContent.type) {
      case EduContentTypeEnum.BOEKE:
        return [searchResultActionDictionary.openBoeke];

      case EduContentTypeEnum.EXERCISE:
        return [
          searchResultActionDictionary.openEduContentAsExercise,
          searchResultActionDictionary.openEduContentAsSolution
        ];
    }

    if (eduContent.streamable) {
      return [searchResultActionDictionary.openEduContentAsStream];
    } else {
      return [searchResultActionDictionary.openEduContentAsDownload];
    }
  }
}

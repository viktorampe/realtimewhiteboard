import { Injectable } from '@angular/core';
import { DalState, EduContent } from '@campus/dal';
import { Store } from '@ngrx/store';
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

const SearchResultActionDictionary: {
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
  constructor(private store: Store<DalState>) {}

  /* what actions
  - link task
  - unlink task
  - toggle favorite
  - open static
  - open exercise
  */

  getActionsForEduContent(
    eduContent: EduContent
  ): SearchResultActionInterface[] {
    // search result = EduContent + EduContentMetaData relation
    // get actions based on EduContent type
    return this.getEduContentActions(eduContent);
  }

  private getEduContentActions(
    eduContent: EduContent
  ): SearchResultActionInterface[] {
    const actions: SearchResultActionInterface[] = [];

    switch (eduContent.type) {
      case EduContentTypeEnum.BOEKE:
        actions.push(SearchResultActionDictionary.openBoeke);
        break;
      case EduContentTypeEnum.EXERCISE:
        actions.push(
          SearchResultActionDictionary.openEduContentAsExercise,
          SearchResultActionDictionary.openEduContentAsSolution
        );
        break;
    }

    if (eduContent.streamable) {
      actions.push(SearchResultActionDictionary.openEduContentAsStream);
    } else {
      actions.push(SearchResultActionDictionary.openEduContentAsDownload);
    }

    return actions;
  }
}

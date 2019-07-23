import { forwardRef, Inject, Injectable } from '@angular/core';
import { EduContent } from '@campus/dal';
import {
  ContentActionsServiceInterface,
  CONTENT_OPENER_TOKEN
} from './content-actions.service.interface';

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

@Injectable({
  providedIn: 'root'
})
export class ContentActionsService implements ContentActionsServiceInterface {
  constructor(
    @Inject(forwardRef(() => CONTENT_OPENER_TOKEN))
    private contentOpener: ContentOpenerInterface
  ) {}

  private contentActionDictionary: {
    [key: string]: ContentActionInterface;
  } = {
    openEduContentAsExercise: {
      label: 'Openen',
      icon: 'exercise:open',
      tooltip: 'Open oefening zonder oplossingen',
      handler: this.contentOpener.openEduContentAsExercise
    },
    openEduContentAsSolution: {
      label: 'Toon oplossing',
      icon: 'exercise:finished',
      tooltip: 'Open oefening met oplossingen',
      handler: this.contentOpener.openEduContentAsSolution
    },
    openEduContentAsStream: {
      label: 'Openen',
      icon: 'lesmateriaal',
      tooltip: 'Open het lesmateriaal',
      handler: this.contentOpener.openEduContentAsStream
    },
    openEduContentAsDownload: {
      label: 'Downloaden',
      icon: 'download',
      tooltip: 'Download het lesmateriaal',
      handler: this.contentOpener.openEduContentAsDownload
    },
    openBoeke: {
      label: 'Openen',
      icon: 'boeken',
      tooltip: 'Open het bordboek',
      handler: this.contentOpener.openBoeke
    }
  };

  /**
   * Gets all actions for the provided eduContent
   *
   * @param {EduContent} eduContent
   * @returns {ContentActionInterface[]}
   * @memberof ContentActionsService
   */
  getActionsForEduContent(eduContent: EduContent): ContentActionInterface[] {
    return this.getEduContentActions(eduContent);
  }

  private getEduContentActions(
    eduContent: EduContent
  ): ContentActionInterface[] {
    switch (eduContent.type) {
      case EduContentTypeEnum.BOEKE:
        return [this.contentActionDictionary.openBoeke];

      case EduContentTypeEnum.EXERCISE:
        return [
          this.contentActionDictionary.openEduContentAsExercise,
          this.contentActionDictionary.openEduContentAsSolution
        ];
    }

    if (eduContent.streamable) {
      return [this.contentActionDictionary.openEduContentAsStream];
    } else {
      return [this.contentActionDictionary.openEduContentAsDownload];
    }
  }
}

import { forwardRef, Inject, Injectable } from '@angular/core';
import { EduContent } from '@campus/dal';
import {
  ContentActionInterface,
  ContentActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN,
  EduContentTypeEnum
} from './content-actions.service.interface';

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

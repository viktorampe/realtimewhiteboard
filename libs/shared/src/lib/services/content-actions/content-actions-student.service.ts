import { forwardRef, Inject, Injectable } from '@angular/core';
import { EduContent } from '@campus/dal';
import { EduContentTypeEnum } from '../../enums';
import {
  ContentActionInterface,
  ContentActionsServiceInterface,
  ContentOpenerInterface,
  CONTENT_OPENER_TOKEN
} from './content-actions.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentActionsStudentService
  implements ContentActionsServiceInterface {
  constructor(
    @Inject(forwardRef(() => CONTENT_OPENER_TOKEN))
    private contentOpener: ContentOpenerInterface
  ) {}

  public contentActionDictionary: {
    [key: string]: ContentActionInterface;
  } = {
    openEduContentAsExercise: {
      label: 'Openen',
      icon: 'exercise:open',
      tooltip: 'Open oefening',
      handler: this.contentOpener.openEduContentAsExercise.bind(
        this.contentOpener
      )
    },
    openEduContentAsSolution: {
      label: 'Toon oplossing',
      icon: 'exercise:finished',
      tooltip: 'Open oefening met oplossingen',
      handler: this.contentOpener.openEduContentAsSolution.bind(
        this.contentOpener
      )
    },
    openEduContentAsStream: {
      label: 'Openen',
      icon: 'lesmateriaal',
      tooltip: 'Open het lesmateriaal',
      handler: this.contentOpener.openEduContentAsStream.bind(
        this.contentOpener
      )
    },
    openEduContentAsDownload: {
      label: 'Downloaden',
      icon: 'download',
      tooltip: 'Download het lesmateriaal',
      handler: this.contentOpener.openEduContentAsDownload.bind(
        this.contentOpener
      )
    },
    openBoeke: {
      label: 'Openen',
      icon: 'book',
      tooltip: 'Open het bordboek',
      handler: this.contentOpener.openBoeke.bind(this.contentOpener)
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
        return [this.contentActionDictionary.openEduContentAsExercise];
    }

    if (eduContent.streamable) {
      return [this.contentActionDictionary.openEduContentAsStream];
    } else {
      return [this.contentActionDictionary.openEduContentAsDownload];
    }
  }
}

import { forwardRef, Inject, Injectable } from '@angular/core';
import { EduContent } from '@campus/dal';
import {
  ContentActionsServiceInterface,
  CONTENT_OPENER_TOKEN
} from './content-actions.service.interface';

export interface ContentActionInterface {
  actionType: 'open';
  label: string;
  icon: string;
  tooltip: string;
  handler: Function;
}

export interface ContentOpenerInterface {
  openEduContentAsExercise(eduContent: EduContent): void;
  openEduContentAsSolution(eduContent: EduContent): void;
  openEduContentAsStream(eduContent: EduContent): void;
  openEduContentAsDownload(eduContent: EduContent): void;
  openBoeke(eduContent: EduContent): void;
}

enum EduContentTypeEnum {
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

  private actionHandlers = new Map<string, (eduContent: EduContent) => void>([
    [
      'openEduContentAsExercise',
      (input: EduContent): void =>
        this.contentOpener.openEduContentAsExercise(input)
    ],
    [
      'openEduContentAsSolution',
      (input: EduContent): void =>
        this.contentOpener.openEduContentAsSolution(input)
    ],
    [
      'openEduContentAsStream',
      (input: EduContent): void =>
        this.contentOpener.openEduContentAsStream(input)
    ],
    [
      'openEduContentAsDownload',
      (input: EduContent): void =>
        this.contentOpener.openEduContentAsDownload(input)
    ],

    [
      'openBoeke',
      (input: EduContent): void => this.contentOpener.openBoeke(input)
    ]
  ]);

  private contentActionDictionary: {
    [key: string]: ContentActionInterface;
  } = {
    openEduContentAsExercise: {
      actionType: 'open',
      label: 'Openen',
      icon: 'exercise:open',
      tooltip: 'Open oefening zonder oplossingen',
      handler: this.actionHandlers.get('openEduContentAsExercise')
    },
    openEduContentAsSolution: {
      actionType: 'open',
      label: 'Toon oplossing',
      icon: 'exercise:finished',
      tooltip: 'Open oefening met oplossingen',
      handler: this.actionHandlers.get('openEduContentAsSolution')
    },
    openEduContentAsStream: {
      actionType: 'open',
      label: 'Openen',
      icon: 'lesmateriaal',
      tooltip: 'Open het lesmateriaal',
      handler: this.actionHandlers.get('openEduContentAsStream')
    },
    openEduContentAsDownload: {
      actionType: 'open',
      label: 'Downloaden',
      icon: 'download',
      tooltip: 'Download het lesmateriaal',
      handler: this.actionHandlers.get('openEduContentAsDownload')
    },
    openBoeke: {
      actionType: 'open',
      label: 'Openen',
      icon: 'boeken',
      tooltip: 'Open het bordboek',
      handler: this.actionHandlers.get('openBoeke')
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

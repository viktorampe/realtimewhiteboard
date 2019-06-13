import { Injectable } from '@angular/core';
import {
  BundleInterface,
  DalActions,
  EduContent,
  EduContentFixture,
  EduContentMetadataFixture,
  EffectFeedbackFixture,
  EffectFeedbackInterface,
  FavoriteFixture,
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface,
  LearningAreaFixture,
  LearningAreaInterface,
  Priority,
  TaskInterface
} from '@campus/dal';
import { ViewModelInterface } from '@campus/testing';
import { BehaviorSubject } from 'rxjs';
import { QuickLinkTypeEnum } from './quick-link-type.enum';
import {
  QuickLinkActionInterface,
  QuickLinkCategoryInterface
} from './quick-link.interface';
import { QuickLinkViewModel } from './quick-link.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockQuickLinkViewModel
  implements ViewModelInterface<QuickLinkViewModel> {
  private quickLinkActions: {
    [key: string]: QuickLinkActionInterface;
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
    },
    openBundle: {
      actionType: 'open',
      label: 'Openen',
      icon: 'bundle',
      tooltip: 'Navigeer naar de bundel pagina',
      handler: 'openBundle'
    },
    openTask: {
      actionType: 'open',
      label: 'Openen',
      icon: 'task',
      tooltip: 'Navigeer naar de taken pagina',
      handler: 'openTask'
    },
    openArea: {
      actionType: 'open',
      label: 'Openen',
      icon: 'lesmateriaal',
      tooltip: 'Navigeer naar de leergebied pagina',
      handler: 'openArea'
    },
    openBoeke: {
      actionType: 'open',
      label: 'Openen',
      icon: 'boeken',
      tooltip: 'Open het bordboek',
      handler: 'openBoeke'
    },
    openSearch: {
      actionType: 'open',
      label: 'Openen',
      icon: 'magnifier',
      tooltip: 'Open de zoekopdracht',
      handler: 'openSearch'
    },
    edit: {
      actionType: 'manage',
      label: 'Bewerken',
      icon: 'edit',
      tooltip: 'Pas de naam van het item aan',
      handler: 'edit'
    },
    remove: {
      actionType: 'manage',
      label: 'Verwijderen',
      icon: 'delete',
      tooltip: 'Verwijder het item',
      handler: 'remove'
    },
    none: {
      actionType: 'open',
      label: '',
      icon: '',
      tooltip: '',
      handler: ''
    }
  };

  private feedback$ = new BehaviorSubject<EffectFeedbackInterface>(
    this.getMockEffectFeedBack()
  );
  private _quickLink$ = new BehaviorSubject(this.getMockQuickLinkCategories());

  public getFeedback$ = () => this.feedback$;

  public getQuickLinkCategories$ = (mode: QuickLinkTypeEnum) =>
    this._quickLink$;

  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public remove(id: number, mode: QuickLinkTypeEnum): void {}

  public onFeedbackDismiss(): void {}

  private getMockQuickLinkCategories(): QuickLinkCategoryInterface[] {
    const mockCreatedDate = new Date(2019, 5, 7, 12, 0, 0, 0);

    return [
      {
        type: FavoriteTypesEnum.BOEKE,
        title: 'bordboeken',
        order: 1,
        quickLinks: [
          {
            ...new FavoriteFixture({
              id: 1,
              name: 'Favorite_1',
              type: FavoriteTypesEnum.BOEKE,
              learningAreaId: 1,
              learningArea: new LearningAreaFixture({
                id: 1,
                icon: 'learning-area:polpo-aardrijkskunde'
              }),
              created: new Date(mockCreatedDate.setHours(15))
            }),
            defaultAction: this.quickLinkActions.openBoeke,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          },
          {
            ...new FavoriteFixture({
              id: 2,
              name: 'Favorite_2',
              type: FavoriteTypesEnum.BOEKE,
              learningAreaId: 1,
              learningArea: new LearningAreaFixture({
                id: 1,
                icon: 'learning-area:polpo-aardrijkskunde'
              }),
              created: new Date(mockCreatedDate.setHours(12))
            }),
            defaultAction: this.quickLinkActions.openBoeke,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          },
          {
            ...new FavoriteFixture({
              id: 3,
              name: 'Favorite_3',
              type: FavoriteTypesEnum.BOEKE,
              learningAreaId: 19,
              learningArea: new LearningAreaFixture({
                id: 19,
                icon: 'learning-area:polpo-wiskunde'
              }),
              created: new Date(mockCreatedDate.setHours(13))
            }),
            defaultAction: this.quickLinkActions.openBoeke,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          }
        ]
      },
      {
        type: FavoriteTypesEnum.EDUCONTENT,
        title: 'lesmateriaal',
        order: 2,
        quickLinks: [
          {
            ...new FavoriteFixture({
              id: 4,
              name: 'Favorite_4',
              type: FavoriteTypesEnum.EDUCONTENT,
              learningAreaId: 1,
              learningArea: new LearningAreaFixture({
                id: 1,
                icon: 'learning-area:polpo-aardrijkskunde'
              }),
              created: new Date(mockCreatedDate.setHours(13)),
              eduContentId: 1,
              eduContent: new EduContentFixture({ contentType: 'exercise' })
            }),
            defaultAction: this.quickLinkActions.openEduContentAsExercise,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          },
          {
            ...new FavoriteFixture({
              id: 5,
              name: 'Favorite_5',
              type: FavoriteTypesEnum.EDUCONTENT,
              learningAreaId: 19,
              learningArea: new LearningAreaFixture({
                id: 19,
                icon: 'learning-area:polpo-wiskunde'
              }),
              created: new Date(mockCreatedDate.setHours(16)),
              eduContentId: 2,
              eduContent: new EduContentFixture(
                { id: 2, contentType: 'video' },
                new EduContentMetadataFixture({
                  streamable: true
                })
              )
            }),
            defaultAction: this.quickLinkActions.openEduContentAsStream,
            alternativeOpenActions: [
              this.quickLinkActions.openEduContentAsDownload
            ],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          }
        ]
      },
      {
        type: FavoriteTypesEnum.BUNDLE,
        title: 'bundels',
        order: 3,
        quickLinks: [
          {
            ...new FavoriteFixture({
              id: 6,
              name: 'Favorite_6',
              type: FavoriteTypesEnum.BUNDLE,
              learningAreaId: 19,
              learningArea: new LearningAreaFixture({
                id: 19,
                icon: 'learning-area:polpo-wiskunde'
              }),
              created: new Date(mockCreatedDate.setHours(14))
            }),
            defaultAction: this.quickLinkActions.openBundle,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          }
        ]
      },
      {
        type: FavoriteTypesEnum.TASK,
        title: 'taken',
        order: 4,
        quickLinks: [
          {
            ...new FavoriteFixture({
              id: 7,
              name: 'Favorite_7',
              type: FavoriteTypesEnum.TASK,
              learningAreaId: 19,
              learningArea: new LearningAreaFixture({
                id: 19,
                icon: 'learning-area:polpo-wiskunde'
              }),
              created: new Date(mockCreatedDate.setHours(13))
            }),
            defaultAction: this.quickLinkActions.openTask,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          }
        ]
      },
      {
        type: FavoriteTypesEnum.SEARCH,
        title: 'zoekopdrachten',
        order: 5,
        quickLinks: [
          {
            ...new FavoriteFixture({
              id: 8,
              name: 'Favorite_8',
              type: FavoriteTypesEnum.SEARCH,
              learningAreaId: 19,
              learningArea: new LearningAreaFixture({
                id: 19,
                icon: 'learning-area:polpo-wiskunde'
              }),
              created: new Date(mockCreatedDate.setHours(15))
            }),
            defaultAction: this.quickLinkActions.openSearch,
            alternativeOpenActions: [],
            manageActions: [
              this.quickLinkActions.edit,
              this.quickLinkActions.remove
            ]
          }
        ]
      }
    ];
  }

  private getMockEffectFeedBack(): EffectFeedbackInterface {
    const mockAction = new DalActions.ActionSuccessful({
      successfulAction: 'test'
    });

    const mockFeedBack = new EffectFeedbackFixture({
      id: '1',
      triggerAction: null,
      message: 'This is a message',
      type: 'error',
      userActions: [
        {
          title: 'klik',
          userAction: mockAction
        }
      ],
      timeStamp: 1,
      display: true,
      priority: Priority.HIGH,
      useDefaultCancel: true
    });

    return mockFeedBack;
  }

  public openBundle(bundle: BundleInterface): void {}

  public openTask(task: TaskInterface): void {}

  public openArea(area: LearningAreaInterface): void {}

  public openStaticContent(eduContent: EduContent, stream?: boolean): void {}

  public openExercise(eduContent: EduContent, withSolution?: boolean): void {}

  public openSearch(
    quickLink: FavoriteInterface | HistoryInterface,
    type: QuickLinkTypeEnum
  ) {}
}

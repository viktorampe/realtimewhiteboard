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
import { QuickLinkViewModel } from './quick-link.viewmodel';

@Injectable({
  providedIn: 'root'
})
export class MockQuickLinkViewModel
  implements ViewModelInterface<QuickLinkViewModel> {
  private feedback$ = new BehaviorSubject<EffectFeedbackInterface>(this.getMockEffectFeedBack());

  public getFeedback$ = () => this.feedback$;
  

  public getQuickLinks$ = (mode: QuickLinkTypeEnum) =>
    new BehaviorSubject(this.getMockFavoriteQuickLinks());
  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public remove(id: number, mode: QuickLinkTypeEnum): void {}

  public onFeedbackDismiss(): void {}

  private getMockFavoriteQuickLinks(): FavoriteInterface[] {
    const mockCreatedDate = new Date(2019, 5, 7, 12, 0, 0, 0);

    return [
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
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
      new FavoriteFixture({
        id: 9,
        name: 'Favorite_9',
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
            streamable: false
          })
        )
      })
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

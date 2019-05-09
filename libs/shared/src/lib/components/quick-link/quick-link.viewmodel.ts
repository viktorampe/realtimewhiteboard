import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  EduContent,
  EffectFeedbackInterface,
  FavoriteInterface,
  FavoriteTypesEnum,
  HistoryInterface
} from '@campus/dal';
import { Observable } from 'rxjs';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '../../content/open-static-content.interface';
import {
  ScormExerciseServiceInterface,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '../../scorm/scorm-exercise.service.interface';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable()
export class QuickLinkViewModel {
  constructor(
    private router: Router,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface
  ) {}

  public quickLinks$: Observable<HistoryInterface[] | FavoriteInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;
  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public delete(id: number, mode: QuickLinkTypeEnum): void {}

  public openFavoriteContent(
    favorite: FavoriteInterface,
    option?: 'download' | 'withSolution' | 'fromHistory'
  ): void {
    switch (favorite.type) {
      case FavoriteTypesEnum.AREA:
        this.router.navigate(['/edu-content', favorite.learningAreaId]);
        break;
      case FavoriteTypesEnum.BOEKE:
      case FavoriteTypesEnum.EDUCONTENT:
        const eduContent: EduContent = Object.assign(
          new EduContent(),
          favorite.eduContent
        );
        if (eduContent.type === 'exercise') {
          this.scormExerciseService.previewExerciseFromUnlockedContent(
            null,
            favorite.eduContentId,
            null,
            option === 'withSolution'
          );
        } else {
          this.openStaticContentService.open(eduContent);
        }
        break;
      case FavoriteTypesEnum.BUNDLE:
        this.router.navigate([
          '/bundles',
          favorite.learningAreaId,
          favorite.bundleId
        ]);
        break;
      case FavoriteTypesEnum.TASK:
        this.router.navigate([
          '/tasks',
          favorite.learningAreaId,
          favorite.taskId
        ]);
        break;
      case FavoriteTypesEnum.SEARCH:
        this.router.navigate(['/edu-content', favorite.learningAreaId], {
          queryParams: {
            [option === 'fromHistory'
              ? 'history_id'
              : 'favorite_id']: favorite.id
          }
        });
        break;
    }
  }
}

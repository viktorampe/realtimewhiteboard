import { Inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  DalState,
  EduContent,
  EffectFeedbackInterface,
  FavoriteActions,
  FavoriteInterface,
  HistoryInterface,
  LearningAreaInterface,
  TaskInterface
} from '@campus/dal';
import { Update } from '@ngrx/entity';
import { Action, Store } from '@ngrx/store';
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
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface,
    private router: Router,
    @Inject(OPEN_STATIC_CONTENT_SERVICE_TOKEN)
    private openStaticContentService: OpenStaticContentServiceInterface,
    @Inject(SCORM_EXERCISE_SERVICE_TOKEN)
    private scormExerciseService: ScormExerciseServiceInterface
  ) {}

  public quickLinks$: Observable<HistoryInterface[] | FavoriteInterface[]>;
  public feedback$: Observable<EffectFeedbackInterface>;

  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {
    let action: Action;
    switch (mode) {
      case QuickLinkTypeEnum.FAVORITES:
        const favorite: Update<FavoriteInterface> = {
          id,
          changes: { name }
        };
        action = new FavoriteActions.UpdateFavorite({
          userId: this.authService.userId,
          favorite,
          useCustomErrorHandler: true
        });

        break;
      case QuickLinkTypeEnum.HISTORY:
        // TODO: dispatch update history action if relevant
        throw new Error('no History State yet');
      default:
        return;
    }

    this.store.dispatch(action);
  }
  public delete(id: number, mode: QuickLinkTypeEnum): void {
    let action: Action;
    switch (mode) {
      case QuickLinkTypeEnum.FAVORITES:
        action = new FavoriteActions.DeleteFavorite({
          id: id,
          userId: this.authService.userId,
          useCustomErrorHandler: true
        });
        break;
      case QuickLinkTypeEnum.HISTORY:
        // TODO: dispatch delete history action if relevant
        throw new Error('no History State yet');
      default:
        return;
    }
    this.store.dispatch(action);
  }

  public openBundle(bundle: BundleInterface): void {
    this.router.navigate(['/bundles', bundle.learningAreaId, bundle.id]);
  }

  public openTask(task: TaskInterface): void {
    this.router.navigate(['/tasks', task.learningAreaId, task.id]);
  }

  public openArea(area: LearningAreaInterface): void {
    this.router.navigate(['/edu-content', area.id]);
  }

  public openStaticContent(eduContent: EduContent, stream?: boolean): void {
    this.openStaticContentService.open(eduContent, stream);
  }

  public openExercise(eduContent: EduContent, withSolution?: boolean): void {
    this.scormExerciseService.previewExerciseFromUnlockedContent(
      null,
      eduContent.id,
      null,
      !!withSolution
    );
  }

  public openSearch(
    quickLink: FavoriteInterface | HistoryInterface,
    type: QuickLinkTypeEnum
  ): void {
    let queryParams: Params;
    switch (type) {
      case QuickLinkTypeEnum.FAVORITES:
        queryParams = { favorite_id: quickLink.id };
        break;
      case QuickLinkTypeEnum.HISTORY:
        queryParams = { history_id: quickLink.id };
        break;
    }
    this.router.navigate(['/edu-content', quickLink.learningAreaId, 'term'], {
      queryParams
    });
  }
}

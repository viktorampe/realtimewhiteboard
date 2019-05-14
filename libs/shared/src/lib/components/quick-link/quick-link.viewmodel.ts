import { Inject, Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleInterface,
  BundleQueries,
  DalState,
  EduContent,
  EduContentQueries,
  EffectFeedbackActions,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  HistoryInterface,
  LearningAreaInterface,
  LearningAreaQueries,
  TaskInterface,
  TaskQueries
} from '@campus/dal';
import { Update } from '@ngrx/entity';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  OpenStaticContentServiceInterface,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN
} from '../../content/open-static-content.interface';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '../../feedback';
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
    private scormExerciseService: ScormExerciseServiceInterface,
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private feedBackService: FeedBackServiceInterface
  ) {}

  public getQuickLinks$(
    mode: QuickLinkTypeEnum
  ): Observable<FavoriteInterface[] | HistoryInterface[]> {
    if (mode === QuickLinkTypeEnum.FAVORITES) {
      return this.composeQuickLink$(
        this.store.pipe(
          select(FavoriteQueries.getAll),
          map(favorites =>
            favorites.filter(fav => fav.type !== FavoriteTypesEnum.AREA)
          )
        )
      );
    }
    if (mode === QuickLinkTypeEnum.HISTORY) {
      throw new Error('no History State yet');
      // return this.composeQuickLink$(
      //   this.store.pipe(select(HistoryQueries.getAll))
      // );
    }
  }

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

  public remove(id: number, mode: QuickLinkTypeEnum): void {
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

  public onFeedbackDismiss(event: {
    action: Action;
    feedbackId: string;
  }): void {
    if (event.action) this.store.dispatch(event.action);

    this.store.dispatch(
      new EffectFeedbackActions.DeleteEffectFeedback({ id: event.feedbackId })
    );
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
  private composeQuickLink$(
    quickLinksData$: Observable<FavoriteInterface[] | HistoryInterface[]>
  ): Observable<FavoriteInterface[] | HistoryInterface[]> {
    return combineLatest(
      quickLinksData$,
      this.store.pipe(select(LearningAreaQueries.getAllEntities)),
      this.store.pipe(select(EduContentQueries.getAllEntities)),
      this.store.pipe(select(TaskQueries.getAllEntities)),
      this.store.pipe(select(BundleQueries.getAllEntities))
    ).pipe(
      map(
        ([
          quickLinks,
          learningAreaDict,
          eduContentDict,
          taskDict,
          bundleDict
        ]) =>
          quickLinks.map(qL => ({
            ...qL,
            // add relation data
            learningArea: qL.learningAreaId
              ? learningAreaDict[qL.learningAreaId]
              : undefined,
            eduContent: qL.eduContentId
              ? eduContentDict[qL.eduContentId]
              : undefined,
            task: qL.taskId ? taskDict[qL.taskId] : undefined,
            bundle: qL.bundleId ? bundleDict[qL.bundleId] : undefined
          }))
      )
    );
  }

  public getFeedback$(): Observable<EffectFeedbackInterface> {
    const actionTypes = FavoriteActions.FavoritesActionTypes;
    // TODO once History has actions
    // const actionTypes = [...FavoriteActions.FavoritesActionTypes,...HistoryActions.HistoryActionTypes]

    return this.store.pipe(
      select(EffectFeedbackQueries.getNextErrorFeedbackForActions, {
        actionTypes: [actionTypes.UpdateFavorite, actionTypes.DeleteFavorite]
      }),
      map(feedBack => this.feedBackService.addDefaultCancelButton(feedBack))
    );
  }
}

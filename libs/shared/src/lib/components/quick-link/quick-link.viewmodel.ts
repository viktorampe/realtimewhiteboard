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
  HistoryActions,
  HistoryInterface,
  HistoryQueries,
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
import {
  quickLinkActionDictionary,
  QuickLinkActionInterface,
  QuickLinkCategoryInterface,
  QuickLinkCategoryMap,
  QuickLinkInterface
} from './quick-link.interface';

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

  public getQuickLinkCategories$(
    mode: QuickLinkTypeEnum
  ): Observable<QuickLinkCategoryInterface[]> {
    let quickLinksDict$: Observable<{
      [key: string]: FavoriteInterface[] | HistoryInterface[];
    }>;

    if (mode === QuickLinkTypeEnum.FAVORITES) {
      quickLinksDict$ = this.store.pipe(
        select(FavoriteQueries.favoritesByType),
        map(favoriteCategories => {
          delete favoriteCategories['area']; // filter out category learning area
          return favoriteCategories;
        })
      );
    }

    if (mode === QuickLinkTypeEnum.HISTORY) {
      quickLinksDict$ = this.store.pipe(select(HistoryQueries.historyByType));
    }

    return this.composeQuickLinkCategories$(quickLinksDict$, mode);
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
          customFeedbackHandlers: { useCustomErrorHandler: true }
        });

        break;
      case QuickLinkTypeEnum.HISTORY:
        // dispatch update history action if relevant
        // no option to rename a history item yet
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
          customFeedbackHandlers: { useCustomErrorHandler: true }
        });
        break;
      case QuickLinkTypeEnum.HISTORY:
        action = new HistoryActions.DeleteHistory({
          id: id,
          userId: this.authService.userId,
          customFeedbackHandlers: { useCustomErrorHandler: true }
        });
        break;
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

  public getFeedback$(): Observable<EffectFeedbackInterface> {
    const favoritesActionTypes = FavoriteActions.FavoritesActionTypes;
    const historyActionTypes = HistoryActions.HistoryActionTypes;

    return this.store.pipe(
      select(EffectFeedbackQueries.getNextErrorFeedbackForActions, {
        actionTypes: [
          favoritesActionTypes.UpdateFavorite,
          favoritesActionTypes.DeleteFavorite,
          historyActionTypes.DeleteHistory
        ]
      }),
      map(feedBack => this.feedBackService.addDefaultCancelButton(feedBack))
    );
  }

  private composeQuickLinkCategories$(
    quickLinksDict$: Observable<{
      [key: string]: FavoriteInterface[] | HistoryInterface[];
    }>,
    mode: QuickLinkTypeEnum
  ): Observable<QuickLinkCategoryInterface[]> {
    return combineLatest(
      quickLinksDict$,
      this.store.pipe(select(LearningAreaQueries.getAllEntities)),
      this.store.pipe(select(EduContentQueries.getAllEntities)),
      this.store.pipe(select(TaskQueries.getAllEntities)),
      this.store.pipe(select(BundleQueries.getAllEntities))
    ).pipe(
      map(
        ([
          quickLinkDict,
          learningAreaDict,
          eduContentDict,
          taskDict,
          bundleDict
        ]) =>
          Object.keys(quickLinkDict).map(
            key =>
              ({
                type: key,
                title: this.getCategoryTitle(quickLinkDict[key][0]),
                order: this.getCategoryOrder(quickLinkDict[key][0]),
                quickLinks: quickLinkDict[key].map(qL =>
                  this.convertToQuickLink(
                    {
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
                    },
                    mode
                  )
                )
              } as QuickLinkCategoryInterface)
          )
      )
    );
  }

  // adds actions to Favorites and Histories
  private convertToQuickLink(
    value: FavoriteInterface | HistoryInterface,
    mode: QuickLinkTypeEnum
  ): QuickLinkInterface {
    return {
      ...value,
      eduContent: value.eduContent as EduContent,
      defaultAction: this.getDefaultAction(value),
      alternativeOpenActions: this.getAlternativeOpenActions(value),
      manageActions: this.getManageActions(mode)
    };
  }

  private getDefaultAction(
    quickLink: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface {
    switch (quickLink.type) {
      case FavoriteTypesEnum.AREA:
      case 'area':
        return quickLinkActionDictionary.openArea;
      case FavoriteTypesEnum.BOEKE:
      case 'boek-e':
        return quickLinkActionDictionary.openBoeke;
      case FavoriteTypesEnum.EDUCONTENT:
      case 'educontent':
        const eduContent = quickLink.eduContent as EduContent;
        if (eduContent.type === 'exercise') {
          return quickLinkActionDictionary.openEduContentAsExercise;
        } else if (eduContent.streamable) {
          return quickLinkActionDictionary.openEduContentAsStream;
        } else {
          return quickLinkActionDictionary.openEduContentAsDownload;
        }
      case FavoriteTypesEnum.BUNDLE:
      case 'bundle':
        return quickLinkActionDictionary.openBundle;
      case FavoriteTypesEnum.TASK:
      case 'task':
        return quickLinkActionDictionary.openTask;
      case FavoriteTypesEnum.SEARCH:
      case 'history':
        return quickLinkActionDictionary.openSearch;
    }
  }

  private getAlternativeOpenActions(
    quickLink: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface[] {
    switch (quickLink.type) {
      case FavoriteTypesEnum.EDUCONTENT:
      case 'educontent':
        const eduContent = quickLink.eduContent as EduContent;
        if (eduContent.type === 'exercise') {
          return [quickLinkActionDictionary.openEduContentAsSolution];
        } else if (eduContent.streamable) {
          return [quickLinkActionDictionary.openEduContentAsDownload];
        }
    }
    return [];
  }

  private getManageActions(
    mode: QuickLinkTypeEnum
  ): QuickLinkActionInterface[] {
    switch (mode) {
      case QuickLinkTypeEnum.FAVORITES:
        return [
          quickLinkActionDictionary.edit,
          quickLinkActionDictionary.remove
        ];
      case QuickLinkTypeEnum.HISTORY:
        return [quickLinkActionDictionary.remove];
    }
    return [];
  }

  private getCategoryTitle(quickLink: FavoriteInterface | HistoryInterface) {
    return QuickLinkCategoryMap.has(quickLink.type)
      ? QuickLinkCategoryMap.get(quickLink.type).label
      : quickLink.type;
  }

  private getCategoryOrder(quickLink: FavoriteInterface | HistoryInterface) {
    return QuickLinkCategoryMap.has(quickLink.type)
      ? QuickLinkCategoryMap.get(quickLink.type).order
      : -1;
  }
}

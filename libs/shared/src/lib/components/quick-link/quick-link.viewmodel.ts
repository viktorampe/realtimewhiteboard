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
  QuickLinkActionInterface,
  QuickLinkCategoryInterface,
  QuickLinkInterface
} from './quick-link.interface';

@Injectable()
export class QuickLinkViewModel {
  private categories = new Map<
    FavoriteTypesEnum | string,
    { label: string; order: number }
  >([
    // Favorites
    [FavoriteTypesEnum.BOEKE, { label: 'Bordboeken', order: 0 }],
    [FavoriteTypesEnum.EDUCONTENT, { label: 'Lesmateriaal', order: 1 }],
    [FavoriteTypesEnum.SEARCH, { label: 'Zoekopdrachten', order: 2 }],
    [FavoriteTypesEnum.BUNDLE, { label: 'Bundels', order: 3 }],
    [FavoriteTypesEnum.TASK, { label: 'Taken', order: 4 }],
    // History
    ['boek-e', { label: 'Bordboeken', order: 0 }],
    ['educontent', { label: 'Lesmateriaal', order: 1 }],
    ['search', { label: 'Zoekopdrachten', order: 2 }],
    ['bundle', { label: 'Bundels', order: 3 }],
    ['task', { label: 'Taken', order: 4 }]
  ]);

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

    return this.composeQuickLinkCategories$(quickLinksDict$);
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
          customFeedbackHandlers: { useCustomErrorHandler: true }
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

  public getFeedback$(): Observable<EffectFeedbackInterface> {
    const favoritesActionTypes = FavoriteActions.FavoritesActionTypes;
    const historyActionTypes = HistoryActions.HistoryActionTypes;

    return this.store.pipe(
      select(EffectFeedbackQueries.getNextErrorFeedbackForActions, {
        actionTypes: [
          favoritesActionTypes.UpdateFavorite,
          favoritesActionTypes.DeleteFavorite,
          historyActionTypes.UpsertHistory,
          historyActionTypes.DeleteHistory
        ]
      }),
      map(feedBack => this.feedBackService.addDefaultCancelButton(feedBack))
    );
  }

  private composeQuickLinkCategories$(
    quickLinksDict$: Observable<{
      [key: string]: FavoriteInterface[] | HistoryInterface[];
    }>
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
          Object.keys(quickLinkDict).reduce(
            (acc, key) => [
              ...acc,
              {
                type: key,
                title: this.getCategoryTitle(quickLinkDict[key][0]),
                order: this.getCategoryOrder(quickLinkDict[key][0]),
                quickLinks: quickLinkDict[key].map(qL =>
                  this.convertToQuickLink({
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
                  })
                )
              }
            ],
            [] as QuickLinkCategoryInterface[]
          )
      )
    );
  }

  // adds actions to Favorites and Histories
  private convertToQuickLink(
    value: FavoriteInterface | HistoryInterface
  ): QuickLinkInterface {
    return {
      ...value,
      eduContent: value.eduContent as EduContent,
      defaultAction: this.getDefaultAction(value),
      alternativeOpenActions: this.getAlternativeOpenActions(value),
      manageActions: [this.quickLinkActions.edit, this.quickLinkActions.remove]
    };
  }

  private getDefaultAction(
    quickLink: FavoriteInterface | HistoryInterface
  ): QuickLinkActionInterface {
    switch (quickLink.type) {
      case FavoriteTypesEnum.AREA:
      case 'area':
        return this.quickLinkActions.openArea;
      case FavoriteTypesEnum.BOEKE:
      case 'boek-e':
        return this.quickLinkActions.openBoeke;
      case FavoriteTypesEnum.EDUCONTENT:
      case 'educontent':
        const eduContent = quickLink.eduContent as EduContent;
        if (eduContent.type === 'exercise') {
          return this.quickLinkActions.openEduContentAsExercise;
        } else if (eduContent.streamable) {
          return this.quickLinkActions.openEduContentAsStream;
        } else {
          return this.quickLinkActions.openEduContentAsDownload;
        }
      case FavoriteTypesEnum.BUNDLE:
      case 'bundle':
        return this.quickLinkActions.openBundle;
      case FavoriteTypesEnum.TASK:
      case 'task':
        return this.quickLinkActions.openTask;
      case FavoriteTypesEnum.SEARCH:
      case 'search':
        return this.quickLinkActions.openSearch;
      default:
        return this.quickLinkActions.none;
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
          return [this.quickLinkActions.openEduContentAsSolution];
        } else if (eduContent.streamable) {
          return [this.quickLinkActions.openEduContentAsDownload];
        }
    }
    return [];
  }

  private getCategoryTitle(quickLink: FavoriteInterface | HistoryInterface) {
    return this.categories.has(quickLink.type)
      ? this.categories.get(quickLink.type).label
      : quickLink.type;
  }

  private getCategoryOrder(quickLink: FavoriteInterface | HistoryInterface) {
    return this.categories.has(quickLink.type)
      ? this.categories.get(quickLink.type).order
      : -1;
  }
}

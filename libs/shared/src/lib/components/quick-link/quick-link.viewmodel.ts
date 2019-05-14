import { Inject, Injectable } from '@angular/core';
import {
  AuthServiceInterface,
  AUTH_SERVICE_TOKEN,
  BundleQueries,
  DalState,
  EduContentQueries,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  HistoryInterface,
  LearningAreaQueries,
  TaskQueries
} from '@campus/dal';
import { Update } from '@ngrx/entity';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable()
export class QuickLinkViewModel {
  public feedback$: Observable<EffectFeedbackInterface> = this.getFeedback$();

  constructor(
    private store: Store<DalState>,
    @Inject(AUTH_SERVICE_TOKEN) private authService: AuthServiceInterface
  ) {}

  public getQuickLinks$(
    mode: QuickLinkTypeEnum
  ): Observable<FavoriteInterface[] | HistoryInterface[]> {
    if (mode === QuickLinkTypeEnum.FAVORITES) {
      return this.composeQuickLink$(
        this.store.pipe(select(FavoriteQueries.getAll))
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

  public delete(id: number, mode: QuickLinkTypeEnum): void {
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

  private composeQuickLink$<T extends FavoriteInterface | HistoryInterface>(
    quickLinksData$: Observable<T[]>
  ): Observable<T[]> {
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
          quickLinks.map(qL => {
            if (qL.learningAreaId) {
              qL.learningArea = learningAreaDict[qL.learningAreaId];
            }
            if (qL.eduContentId) {
              qL.eduContent = eduContentDict[qL.eduContentId];
            }
            if (qL.taskId) {
              qL.task = taskDict[qL.taskId];
            }
            if (qL.bundleId) {
              qL.bundle = bundleDict[qL.bundleId];
            }

            return qL;
          })
      )
    );
  }

  private getFeedback$(): Observable<EffectFeedbackInterface> {
    const actionTypes = FavoriteActions.FavoritesActionTypes;
    // TODO once History has actions
    // const actionTypes = [...FavoriteActions.FavoritesActionTypes,...HistoryActions.HistoryActionTypes]

    return this.store.pipe(
      select(EffectFeedbackQueries.getNextErrorFeedbackForActions, {
        actionTypes: [actionTypes.UpdateFavorite, actionTypes.DeleteFavorite]
      })
    );
  }
}

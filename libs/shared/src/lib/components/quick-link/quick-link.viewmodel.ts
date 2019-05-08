import { Inject, Injectable } from '@angular/core';
import {
  BundleQueries,
  DalState,
  EduContentQueries,
  EffectFeedbackInterface,
  EffectFeedbackQueries,
  EffectFeedbackReducer,
  FavoriteActions,
  FavoriteInterface,
  FavoriteQueries,
  HistoryInterface,
  LearningAreaQueries,
  TaskQueries
} from '@campus/dal';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FeedBackServiceInterface,
  FEEDBACK_SERVICE_TOKEN
} from '../../feedback';
import { QuickLinkTypeEnum } from './quick-link-type.enum';

@Injectable()
export class QuickLinkViewModel {
  public feedback$: Observable<EffectFeedbackInterface> = this.getFeedback$();
  public update(id: number, name: string, mode: QuickLinkTypeEnum): void {}
  public delete(id: number, mode: QuickLinkTypeEnum): void {}

  constructor(
    private store: Store<DalState>,
    @Inject(FEEDBACK_SERVICE_TOKEN)
    private feedbackService: FeedBackServiceInterface
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
        ]) => {
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
          });
          return quickLinks;
        }
      )
    );
  }

  private getFeedback$(): Observable<EffectFeedbackInterface> {
    const actionTypes = FavoriteActions.FavoritesActionTypes;
    // TODO once History has actions
    // const actionTypes = [...FavoriteActions.FavoritesActionTypes,...HistoryActions.HistoryActionTypes]

    return combineLatest(
      this.getErrorFeedBackForActionType(actionTypes.UpdateFavorite),
      this.getErrorFeedBackForActionType(actionTypes.DeleteFavorite)
    ).pipe(
      map(
        feedbackArray =>
          feedbackArray.sort(EffectFeedbackReducer.sortByPriority)[0]
      )
    );
  }

  private getErrorFeedBackForActionType(
    actionType: string
  ): Observable<EffectFeedbackInterface> {
    return this.store.pipe(
      select(EffectFeedbackQueries.getNextErrorFeedbackForAction, {
        actionType
      })
    );
  }
}

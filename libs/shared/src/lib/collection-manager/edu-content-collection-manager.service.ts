import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  BundleActions,
  BundleInterface,
  BundleQueries,
  DalState,
  EduContent,
  FavoriteQueries,
  FavoriteTypesEnum,
  TaskEduContentActions,
  TaskEduContentInterface,
  TaskEduContentQueries,
  TaskInterface,
  TaskQueries,
  UnlockedContent,
  UnlockedContentActions,
  UnlockedContentQueries,
  UserContentInterface
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

//----------- TO DO: REMOVE WHEN OTHER ISSUES ARE IMPLEMENTED --------------
// mock interface
export interface ItemToggledInCollectionInterface {
  relatedItem: any;
  item: any;
  selected: boolean;
}

// mock token
export const COLLECTION_MANAGER_SERVICE_TOKEN = new InjectionToken(
  'CollectionManagerService'
);

// mock service
@Injectable({
  providedIn: 'root'
})
export class CollectionManagerService {
  manageCollections(
    item: any,
    linkableItems: any[],
    linkedItemIds: number[],
    recentItemIds: number[]
  ): Observable<ItemToggledInCollectionInterface> {
    return of();
  }
}
// ------------------- END REMOVE -------------------------------------- //

export const EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN = new InjectionToken(
  'EduContentCollectionManagerService'
);

@Injectable({
  providedIn: 'root'
})
export class EduContentCollectionManagerService {
  constructor(
    private store: Store<DalState>,
    @Inject(COLLECTION_MANAGER_SERVICE_TOKEN)
    private collectionManagerService: CollectionManagerService
  ) {}

  manageBundlesForEduContent(content: EduContent): void {
    const learningAreaId =
      content.publishedEduContentMetadata &&
      content.publishedEduContentMetadata.learningAreaId;
    let bundles$: Observable<BundleInterface[]>;
    if (learningAreaId) {
      bundles$ = this.store
        .select(BundleQueries.getByLearningAreaId)
        .pipe(
          map(
            (bundlesByLearningArea: {
              [key: string]: BundleInterface[];
            }): BundleInterface[] => bundlesByLearningArea[learningAreaId] || []
          )
        );
    } else {
      bundles$ = this.store.select(BundleQueries.getAll);
    }
    const linkedBundleIds$: Observable<number[]> = this.store
      .select(UnlockedContentQueries.getByEduContentId, {
        eduContentId: content.id
      })
      .pipe(
        map(
          (unlockedContents: UnlockedContent[]): number[] =>
            Array.from(
              new Set(
                unlockedContents.map(
                  unlockedContent => unlockedContent.bundleId
                )
              )
            )
        )
      );
    const recentBundleIds$: Observable<number[]> = combineLatest(
      this.store
        .select(FavoriteQueries.getByType, { type: FavoriteTypesEnum.BUNDLE })
        .pipe(
          map(
            (favorites): number[] =>
              favorites.map(favorite => favorite.bundleId)
          )
        ),
      // TODO: combine with history when state is available
      // this.store
      //   .select(HistoryQueries.getByType, { type: HistoryTypesEnum.BUNDLE })
      //   .pipe(
      //     map((histories): number[] => histories.map(history => history.bundleId))
      //   )
      of([])
    ).pipe(
      map(
        ([favoriteBundleIds, historyBundleIds]: [
          number[],
          number[]
        ]): number[] =>
          Array.from(new Set([...favoriteBundleIds, ...historyBundleIds]))
      )
    );
    combineLatest(bundles$, linkedBundleIds$, recentBundleIds$)
      .pipe(
        switchMap(
          ([bundles, linkedBundleIds, recentBundleIds]: [
            BundleInterface[],
            number[],
            number[]
          ]): Observable<ItemToggledInCollectionInterface> => {
            return this.collectionManagerService.manageCollections(
              content,
              bundles,
              linkedBundleIds,
              recentBundleIds
            );
          }
        )
      )
      .subscribe((bundleToggled: ItemToggledInCollectionInterface) => {
        if (bundleToggled.selected) {
          this.addEduContentToBundle(
            bundleToggled.item,
            bundleToggled.relatedItem
          );
        } else {
          this.removeEduContentFromBundle(
            bundleToggled.item,
            bundleToggled.relatedItem
          );
        }
      });
  }

  manageTasksForContent(content: EduContent): void {
    const tasks$: Observable<TaskInterface[]> = this.store
      .select(TaskQueries.getByLearningAreaId)
      .pipe(
        map(
          (tasksByLearningArea: {
            [key: string]: TaskInterface[];
          }): TaskInterface[] =>
            tasksByLearningArea[
              content.publishedEduContentMetadata.learningAreaId
            ] || []
        )
      );
    const linkedTaskIds$: Observable<number[]> = this.store
      .select(TaskEduContentQueries.getByEduContentId, {
        eduContentId: content.id
      })
      .pipe(
        map(
          (taskEduContents: TaskEduContentInterface[]): number[] =>
            taskEduContents.map(taskEduContent => taskEduContent.taskId)
        )
      );
    const recentTaskIds$: Observable<number[]> = combineLatest(
      this.store
        .select(FavoriteQueries.getByType, { type: FavoriteTypesEnum.TASK })
        .pipe(
          map(
            (favorites): number[] => favorites.map(favorite => favorite.taskId)
          )
        ),
      // TODO: combine with history when state is available
      // this.store
      //   .select(HistoryQueries.getByType, { type: HistoryTypesEnum.TASK })
      //   .pipe(
      //     map((histories): number[] => histories.map(history => history.taskId))
      //   )
      of([])
    ).pipe(
      map(
        ([favoriteTaskIds, historyTaskIds]: [number[], number[]]): number[] =>
          Array.from(new Set([...favoriteTaskIds, ...historyTaskIds]))
      )
    );
    combineLatest(tasks$, linkedTaskIds$, recentTaskIds$)
      .pipe(
        switchMap(
          ([tasks, linkedTaskIds, recentTaskIds]: [
            TaskInterface[],
            number[],
            number[]
          ]): Observable<ItemToggledInCollectionInterface> => {
            return this.collectionManagerService.manageCollections(
              content,
              tasks,
              linkedTaskIds,
              recentTaskIds
            );
          }
        )
      )
      .subscribe((taskToggled: ItemToggledInCollectionInterface) => {
        if (taskToggled.selected) {
          this.addContentToTask(taskToggled.item, taskToggled.relatedItem);
        } else {
          this.removeContentFromTask(taskToggled.item, taskToggled.relatedItem);
        }
      });
  }

  addContentToTask(content: EduContent, task: TaskInterface): void {
    this.store.dispatch(
      new TaskEduContentActions.LinkTaskEduContent({
        taskId: task.id,
        eduContentId: content.id,
        displayResponse: true
      })
    );
  }

  addEduContentToBundle(content: EduContent, bundle: BundleInterface): void {
    this.store.dispatch(
      new BundleActions.LinkEduContent({
        bundleId: bundle.id,
        eduContentId: content.id
      })
    );
  }

  addUserContentToBundle(
    content: UserContentInterface,
    bundle: BundleInterface
  ) {
    this.store.dispatch(
      new BundleActions.LinkUserContent({
        bundleId: bundle.id,
        userContentId: content.id
      })
    );
  }

  removeContentFromTask(content: EduContent, task: TaskInterface): void {
    this.store
      .select(TaskEduContentQueries.getByTaskAndEduContentId, {
        taskId: task.id,
        eduContentId: content.id
      })
      .pipe(take(1))
      .subscribe(taskEduContent => {
        this.store.dispatch(
          new TaskEduContentActions.DeleteTaskEduContent({
            id: taskEduContent.id
          })
        );
      });
  }

  removeEduContentFromBundle(
    content: EduContent,
    bundle: BundleInterface
  ): void {
    this.store
      .select(UnlockedContentQueries.getByBundleAndEduContentId, {
        bundleId: bundle.id,
        eduContentId: content.id
      })
      .pipe(take(1))
      .subscribe(unlockedContent => {
        this.store.dispatch(
          new UnlockedContentActions.DeleteUnlockedContent({
            id: unlockedContent.id
          })
        );
      });
  }

  removeUserContentFromBundle(
    content: EduContent,
    bundle: BundleInterface
  ): void {
    this.store
      .select(UnlockedContentQueries.getByBundleAndUserContentId, {
        bundleId: bundle.id,
        userContentId: content.id
      })
      .pipe(take(1))
      .subscribe(unlockedContent => {
        this.store.dispatch(
          new UnlockedContentActions.DeleteUnlockedContent({
            id: unlockedContent.id
          })
        );
      });
  }
}

import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  BundleInterface,
  BundleQueries,
  DalState,
  EduContentInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  TaskEduContentInterface,
  TaskEduContentQueries,
  TaskInterface,
  TaskQueries,
  UnlockedContent,
  UnlockedContentQueries,
  UserContentInterface
} from '@campus/dal';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

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

  manageBundlesForEduContent(content: EduContentInterface): void {
    combineLatest(
      this.store
        .select(BundleQueries.getByLearningAreaId)
        .pipe(
          map(
            (bundlesByLearningArea: {
              [key: string]: BundleInterface[];
            }): BundleInterface[] =>
              bundlesByLearningArea[
                content.publishedEduContentMetadata.learningAreaId
              ] || []
          )
        ),
      this.store
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
          ),
          shareReplay(1)
        ),
      this.store
        .select(FavoriteQueries.getByType, { type: FavoriteTypesEnum.BUNDLE })
        .pipe(
          map(
            (favorites): number[] =>
              favorites.map(favorite => favorite.bundleId)
          ),
          shareReplay(1)
        ),
      // TODO: combine with history when state is available
      // this.store
      //   .select(HistoryQueries.getByType, { type: HistoryTypesEnum.BUNDLE })
      //   .pipe(
      //     map((histories): number[] => histories.map(history => history.bundleId)),
      //     shareReplay(1)
      //   )
      of([])
    )
      .pipe(
        switchMap(
          ([bundles, linkedBundleIds, favoriteBundleIds, historyBundleIds]: [
            BundleInterface[],
            number[],
            number[],
            number[]
          ]): Observable<ItemToggledInCollectionInterface> => {
            const recentBundleIds = Array.from(
              new Set([...favoriteBundleIds, ...historyBundleIds])
            );
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

  manageBundlesForUserContent(content: UserContentInterface): void {
    combineLatest(
      this.store.select(BundleQueries.getAll),
      this.store
        .select(UnlockedContentQueries.getByUserContentId, {
          userContentId: content.id
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
          ),
          shareReplay(1)
        ),
      this.store
        .select(FavoriteQueries.getByType, { type: FavoriteTypesEnum.BUNDLE })
        .pipe(
          map(favorites => favorites.map(favorite => favorite.bundleId)),
          shareReplay(1)
        ),
      // TODO: combine with history when state is available
      // this.store
      //   .select(HistoryQueries.getByType, { type: HistoryTypesEnum.BUNDLE })
      //   .pipe(
      //     map(histories => histories.map(history => history.bundleId)),
      //     shareReplay(1)
      //   )
      of([])
    )
      .pipe(
        switchMap(
          ([bundles, linkedBundleIds, favoriteBundleIds, historyBundleIds]: [
            BundleInterface[],
            number[],
            number[],
            number[]
          ]): Observable<ItemToggledInCollectionInterface> => {
            const recentBundleIds = Array.from(
              new Set([...favoriteBundleIds, ...historyBundleIds])
            );
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
          this.addUserContentToBundle(
            bundleToggled.item,
            bundleToggled.relatedItem
          );
        } else {
          this.removeUserContentFromBundle(
            bundleToggled.item,
            bundleToggled.relatedItem
          );
        }
      });
  }

  manageTasksForContent(content: EduContentInterface): void {
    combineLatest(
      this.store
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
        ),
      this.store
        .select(TaskEduContentQueries.getByEduContentId, {
          eduContentId: content.id
        })
        .pipe(
          map(
            (taskEduContents: TaskEduContentInterface[]): number[] =>
              taskEduContents.map(taskEduContent => taskEduContent.taskId)
          )
        ),
      this.store
        .select(FavoriteQueries.getByType, { type: FavoriteTypesEnum.TASK })
        .pipe(
          map(
            (favorites): number[] => favorites.map(favorite => favorite.taskId)
          ),
          shareReplay(1)
        ),
      // TODO: combine with history when state is available
      // this.store
      //   .select(HistoryQueries.getByType, { type: HistoryTypesEnum.TASK })
      //   .pipe(
      //     map((histories): number[] => histories.map(history => history.taskId)),
      //     shareReplay(1)
      //   )
      of([])
    )
      .pipe(
        switchMap(
          ([tasks, linkedTaskIds, favoriteTaskIds, historyTaskIds]: [
            TaskInterface[],
            number[],
            number[],
            number[]
          ]): Observable<ItemToggledInCollectionInterface> => {
            const recentTaskIds = Array.from(
              new Set([...favoriteTaskIds, ...historyTaskIds])
            );
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

  addContentToTask(content: EduContentInterface, task: TaskInterface) {
    //store actions
  }
  addEduContentToBundle(content: EduContentInterface, bundle: BundleInterface) {
    //store actions
  }
  addUserContentToBundle(
    content: UserContentInterface,
    bundle: BundleInterface
  ) {
    //store actions
  }

  removeContentFromTask(content: EduContentInterface, task: TaskInterface) {
    // select taskEduContent from store by task and content
    // dispatch action to delete taskEduContent
  }
  removeEduContentFromBundle(
    content: EduContentInterface,
    bundle: BundleInterface
  ) {
    // select UnlockedContent from store by bundle and contentId
    // dispatch action to delete UnlockedContent
  }
  removeUserContentFromBundle(
    content: UserContentInterface,
    bundle: BundleInterface
  ) {
    // select UnlockedContent from store by bundle and contentId
    // dispatch action to delete UnlockedContent
  }
}

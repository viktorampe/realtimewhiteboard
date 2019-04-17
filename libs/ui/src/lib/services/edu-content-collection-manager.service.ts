import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  BundleInterface,
  BundleQueries,
  ContentInterface,
  DalState,
  EduContentInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  TaskInterface,
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
    // 1. select info from store
    //      - select all bundles with content.learningAreaId as area
    //      - select bundle ids in which content is included (unlockedContentState)
    //      - select favorite bundleIds
    //      - select history bundle Ids
    combineLatest(
      this.store.select(BundleQueries.getByLearningAreaId, {
        area: content.publishedEduContentMetadata.learningAreaId
      }),
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
        //  2. combine all info needed and pass to manageCollectionsForContent
        //      - content
        //      - collections: all collections
        //      - selectedCollectionIds: in which the content is already selected
        //      - recentCollectionIds: which should be display first in the list
        switchMap(
          ([bundles, linkedBundleIds, favoriteBundleIds, historyBundleIds]) => {
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
        //  3. subscribe the returned observable
        //  4. map events to functions below
        if (bundleToggled.selected) {
          this.addContentToBundle(
            bundleToggled.item,
            bundleToggled.relatedItem
          );
        } else {
          this.removeContentFromBundle(
            bundleToggled.item,
            bundleToggled.relatedItem
          );
        }
      });
  }

  manageBundlesForUserContent(content: UserContentInterface): void {
    //
  }

  manageTasksForContent(content: EduContentInterface): void {
    // analog to bundles
  }

  addContentToTask(content: EduContentInterface, task: TaskInterface) {
    //store actions
  }
  addContentToBundle(content: ContentInterface, bundle: BundleInterface) {
    //store actions
  }

  removeContentFromTask(content: EduContentInterface, task: TaskInterface) {
    // select taskEduContent from store by task and content
    // dispatch action to delete taskEduContent
  }

  removeContentFromBundle(content: ContentInterface, bundle: BundleInterface) {
    // select UnlockedContent from store by bundle and contentId
    // dispatch action to delete UnlockedContent
  }
}

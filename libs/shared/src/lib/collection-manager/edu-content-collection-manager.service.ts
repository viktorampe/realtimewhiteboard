import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  BundleActions,
  BundleInterface,
  BundleQueries,
  ContentInterface,
  DalState,
  EduContentInterface,
  FavoriteInterface,
  FavoriteQueries,
  FavoriteTypesEnum,
  HistoryInterface,
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
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';

//----------- TO DO: REMOVE WHEN OTHER ISSUES ARE IMPLEMENTED --------------
// mock interface
export interface ItemToggledInCollectionInterface {
  relatedItem: any;
  item: any;
  selected: boolean;
}

export interface ManageCollectionItemInterface {
  icon?: string;
  label: string;
  id: number;
  className?: string;
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
    title: string,
    item: ManageCollectionItemInterface,
    linkableItems: ManageCollectionItemInterface[],
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

  /**
   * Open dialog and set up subscriptions to link content to bundles
   *
   * @param content {ContentInterface}
   * @param learningAreaId {number} requiered for EduContent, leave blank for UserContent
   */
  manageBundlesForContent(
    content: ContentInterface,
    learningAreaId: number = null
  ): void {
    // prepare streams
    let bundles$: Observable<BundleInterface[]>;
    if (learningAreaId) {
      bundles$ = this.store.select(BundleQueries.getForLearningAreaId, {
        learningAreaId
      });
    } else {
      bundles$ = this.store.select(BundleQueries.getAll);
    }
    const bundlesCollection$: Observable<
      ManageCollectionItemInterface[]
    > = bundles$.pipe(
      map(
        (bundles: BundleInterface[]): ManageCollectionItemInterface[] => {
          return bundles.map(
            (bundle): ManageCollectionItemInterface => ({
              id: bundle.id,
              label: bundle.name
            })
          );
        }
      ),
      shareReplay(1)
    );
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
        ),
        shareReplay(1)
      );
    const recentBundleIds$: Observable<number[]> = this.getRecentItemsStream(
      FavoriteTypesEnum.BUNDLE,
      'bundleId'
    );

    // subscribe to changeEvent
    const item: ManageCollectionItemInterface = {
      id: content.id,
      label: content.name
    };
    const itemToggle$ = this.getItemToggleStream(
      '"' + item.label + '" toevoegen aan je bundels',
      item,
      bundlesCollection$,
      linkedBundleIds$,
      recentBundleIds$
    );
    itemToggle$.subscribe((bundleToggled: ItemToggledInCollectionInterface) => {
      if (learningAreaId) {
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
      } else {
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
      }
    });
  }

  manageTasksForContent(content: EduContentInterface): void {
    const item: ManageCollectionItemInterface = {
      id: content.id,
      label: content.publishedEduContentMetadata.title
    };

    // prepare streams
    const learningAreaId: number =
      content.publishedEduContentMetadata.learningAreaId;
    const tasksCollection$: Observable<
      ManageCollectionItemInterface[]
    > = this.store
      .select(TaskQueries.getForLearningAreaId, { learningAreaId })
      .pipe(
        map(
          (tasks: TaskInterface[]): ManageCollectionItemInterface[] => {
            return tasks.map(
              (task): ManageCollectionItemInterface => ({
                id: task.id,
                label: task.name
              })
            );
          }
        ),
        shareReplay(1)
      );
    const linkedTaskIds$: Observable<number[]> = this.store
      .select(TaskEduContentQueries.getByEduContentId, {
        eduContentId: content.id
      })
      .pipe(
        map(
          (taskEduContents: TaskEduContentInterface[]): number[] =>
            taskEduContents.map(taskEduContent => taskEduContent.taskId)
        ),
        shareReplay(1)
      );
    const recentTaskIds$: Observable<number[]> = this.getRecentItemsStream(
      FavoriteTypesEnum.TASK,
      'taskId'
    );

    // subscribe to changeEvent
    const itemToggle$: Observable<
      ItemToggledInCollectionInterface
    > = this.getItemToggleStream(
      '"' + item.label + '" toevoegen aan je taken',
      item,
      tasksCollection$,
      linkedTaskIds$,
      recentTaskIds$
    );
    itemToggle$.subscribe((taskToggled: ItemToggledInCollectionInterface) => {
      if (taskToggled.selected) {
        this.addContentToTask(taskToggled.item, taskToggled.relatedItem);
      } else {
        this.removeContentFromTask(taskToggled.item, taskToggled.relatedItem);
      }
    });
  }

  private addContentToTask(
    content: EduContentInterface,
    task: TaskInterface
  ): void {
    this.store.dispatch(
      new TaskEduContentActions.LinkTaskEduContent({
        taskId: task.id,
        eduContentId: content.id,
        displayResponse: true
      })
    );
  }

  private addEduContentToBundle(
    content: ContentInterface,
    bundle: BundleInterface
  ): void {
    this.store.dispatch(
      new BundleActions.LinkEduContent({
        bundleId: bundle.id,
        eduContentId: content.id
      })
    );
  }

  private addUserContentToBundle(
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

  private removeContentFromTask(
    content: ContentInterface,
    task: TaskInterface
  ): void {
    this.store
      .select(TaskEduContentQueries.getByTaskAndEduContentId, {
        taskId: task.id,
        eduContentId: content.id
      })
      .pipe(
        take(1),
        filter(val => !!val)
      )
      .subscribe(taskEduContent => {
        this.store.dispatch(
          new TaskEduContentActions.DeleteTaskEduContent({
            id: taskEduContent.id
          })
        );
      });
  }

  private removeEduContentFromBundle(
    content: ContentInterface,
    bundle: BundleInterface
  ): void {
    this.store
      .select(UnlockedContentQueries.getByBundleAndEduContentId, {
        bundleId: bundle.id,
        eduContentId: content.id
      })
      .pipe(
        take(1),
        filter(val => !!val)
      )
      .subscribe(unlockedContent => {
        this.store.dispatch(
          new UnlockedContentActions.DeleteUnlockedContent({
            id: unlockedContent.id
          })
        );
      });
  }

  private removeUserContentFromBundle(
    content: ContentInterface,
    bundle: BundleInterface
  ): void {
    this.store
      .select(UnlockedContentQueries.getByBundleAndUserContentId, {
        bundleId: bundle.id,
        userContentId: content.id
      })
      .pipe(
        take(1),
        filter(val => !!val)
      )
      .subscribe(unlockedContent => {
        this.store.dispatch(
          new UnlockedContentActions.DeleteUnlockedContent({
            id: unlockedContent.id
          })
        );
      });
  }

  private getRecentItemsStream(
    type: FavoriteTypesEnum,
    key: string
  ): Observable<number[]> {
    return combineLatest(
      this.store.select(FavoriteQueries.getByType, { type }),
      // TODO: combine with history when state is available
      // this.store.select(HistoryQueries.getByType, { type })
      of([])
    ).pipe(
      map(
        ([favorites, histories]: [
          FavoriteInterface[],
          HistoryInterface[]
        ]): number[] => {
          return Array.from(
            new Set<number>(
              ...favorites.map(favorite => favorite[key]),
              ...histories.map(history => history[key])
            )
          );
        }
      ),
      shareReplay(1)
    );
  }

  private getItemToggleStream(
    title: string,
    item: ManageCollectionItemInterface,
    linkableItems$: Observable<ManageCollectionItemInterface[]>,
    linkedItemIds$: Observable<number[]>,
    recentItemIds$: Observable<number[]>
  ) {
    return combineLatest(linkableItems$, linkedItemIds$, recentItemIds$).pipe(
      switchMap(
        ([linkableItems, linkedIds, recentIds]): Observable<
          ItemToggledInCollectionInterface
        > => {
          return this.collectionManagerService.manageCollections(
            title,
            item,
            linkableItems,
            linkedIds,
            recentIds
          );
        }
      )
    );
  }
}

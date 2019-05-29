import { Inject, Injectable } from '@angular/core';
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
  HistoryQueries,
  HistoryTypesEnum,
  TaskEduContentActions,
  TaskEduContentInterface,
  TaskEduContentQueries,
  TaskInterface,
  TaskQueries,
  UnlockedContent,
  UnlockedContentActions,
  UnlockedContentQueries
} from '@campus/dal';
import {
  CollectionManagerServiceInterface,
  COLLECTION_MANAGER_SERVICE_TOKEN,
  ItemToggledInCollectionInterface,
  ManageCollectionItemInterface
} from '@campus/ui';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { EduContentCollectionManagerServiceInterface } from './edu-content-collection-manager.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EduContentCollectionManagerService
  implements EduContentCollectionManagerServiceInterface {
  constructor(
    private store: Store<DalState>,
    @Inject(COLLECTION_MANAGER_SERVICE_TOKEN)
    private collectionManagerService: CollectionManagerServiceInterface
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
    content: ManageCollectionItemInterface,
    task: ManageCollectionItemInterface
  ): void {
    this.store.dispatch(
      new TaskEduContentActions.LinkTaskEduContent({
        taskId: task.id,
        eduContentId: content.id
      })
    );
  }

  private addEduContentToBundle(
    content: ManageCollectionItemInterface,
    bundle: ManageCollectionItemInterface
  ): void {
    this.store.dispatch(
      new BundleActions.LinkEduContent({
        bundleId: bundle.id,
        eduContentId: content.id
      })
    );
  }

  private addUserContentToBundle(
    content: ManageCollectionItemInterface,
    bundle: ManageCollectionItemInterface
  ) {
    this.store.dispatch(
      new BundleActions.LinkUserContent({
        bundleId: bundle.id,
        userContentId: content.id
      })
    );
  }

  private removeContentFromTask(
    content: ManageCollectionItemInterface,
    task: ManageCollectionItemInterface
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
    content: ManageCollectionItemInterface,
    bundle: ManageCollectionItemInterface
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
    content: ManageCollectionItemInterface,
    bundle: ManageCollectionItemInterface
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
    type: FavoriteTypesEnum | HistoryTypesEnum,
    key: string
  ): Observable<number[]> {
    return combineLatest(
      this.store.select(FavoriteQueries.getByType, { type }),
      this.store.select(HistoryQueries.getByType, { type })
    ).pipe(
      map(
        ([favorites, histories]: [
          FavoriteInterface[],
          HistoryInterface[]
        ]): number[] => {
          return Array.from(
            new Set<number>([
              ...favorites.map(favorite => favorite[key]),
              ...histories.map(history => history[key])
            ])
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
      take(1),
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

import {
  Component,
  EventEmitter,
  Injectable,
  InjectionToken,
  Output
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ManageCollectionItemInterface } from '../manage-collection/interfaces/ManageCollectionItem.interface';
import { ItemToggledInCollectionInterface } from './ItemToggledInCollection.interface';

//----------- TO DO: REMOVE WHEN OTHER ISSUES ARE IMPLEMENTED --------------
// mock component
@Component({
  selector: 'campus-manage-collection',
  template: ``
})
export class ManageCollectionComponent {
  @Output() selectionChanged = new EventEmitter<
    ItemToggledInCollectionInterface
  >();
}
// ------------------- END REMOVE -------------------------------------- //

const COLLECTION_MANAGER_SERVICE_TOKEN = new InjectionToken(
  'CollectionManagerService'
);

export interface CollectionMangerInterface {
  mangeCollections(): Observable<ItemToggledInCollectionInterface>;
}

interface ManageCollectionsForContentDataInterface {
  title: string;
  item: ManageCollectionItemInterface;
  linkableItems: ManageCollectionItemInterface[];
  linkedItemIds: Set<number>;
  recentItemIds: Set<number>;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionManagerService {
  private subscription: Subscription;

  constructor(public dialog: MatDialog) {}

  manageCollections(
    title: string,
    item: ManageCollectionItemInterface,
    linkableItems: ManageCollectionItemInterface[],
    linkedItemIds: number[],
    recentItemIds: number[]
  ): Observable<ItemToggledInCollectionInterface> {
    // setup observable
    const itemToggledInCollection$ = new Subject<
      ItemToggledInCollectionInterface
    >();

    // open dialog
    const dialogData: ManageCollectionsForContentDataInterface = {
      title: title,
      item: item,
      linkableItems: linkableItems,
      linkedItemIds: new Set(linkedItemIds),
      recentItemIds: new Set(recentItemIds)
    };

    const dialogRef = this.openDialog(dialogData);

    // listen to component and bubble itemToggledInCollectionEvent
    this.subscription = dialogRef.componentInstance.selectionChanged.subscribe(
      (itemToggleEvent: ItemToggledInCollectionInterface) =>
        itemToggledInCollection$.next(itemToggleEvent)
    );

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        map(() => {
          // clean up subscription on dialog close
          this.subscription.unsubscribe();
          // complete observable on dialog close
          itemToggledInCollection$.complete();
        })
      )
      .subscribe();

    // return observable
    return itemToggledInCollection$;
  }

  openDialog(
    data: ManageCollectionsForContentDataInterface
  ): MatDialogRef<ManageCollectionComponent> {
    // use the ManageCollectionComponent
    // inject the right data
    return this.dialog.open(ManageCollectionComponent, {
      data: data
    });
  }
}

import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
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

interface ManageCollectionsForContentDataInterface {
  title: string;
  item: ManageCollectionItemInterface;
  linkableItems: ManageCollectionItemInterface[];
  linkedItemIds: Set<number>;
  recentItemIds: Set<number>;
}

// ------------------- END REMOVE -------------------------------------- //

@Injectable({
  providedIn: 'root'
})
export class CollectionManagerService {
  private subscription: Subscription;
  private itemToggledInCollection$ = new Subject<any>();

  constructor(public dialog: MatDialog) {}

  manageCollections(
    item: ManageCollectionItemInterface,
    linkableItems: ManageCollectionItemInterface[],
    linkedItemIds: number[],
    recentItemIds: number[]
  ): Observable<ItemToggledInCollectionInterface> {
    // open dialog
    const dialogData: ManageCollectionsForContentDataInterface = {
      title: 'foo', // where does this title come from? I guess the item?
      item: item,
      linkableItems: linkableItems,
      linkedItemIds: new Set(linkedItemIds),
      recentItemIds: new Set(recentItemIds)
    };

    const dialogRef = this.openDialog(dialogData);

    // listen to component and bubble itemToggledInCollectionEvent
    this.subscription = dialogRef.componentInstance.selectionChanged
      .pipe(
        tap((itemToggleEvent: ItemToggledInCollectionInterface) =>
          this.itemToggledInCollection$.next(itemToggleEvent)
        )
      )
      .subscribe();

    dialogRef.afterClosed().subscribe(result => {
      // clean up subscription on dialog close
      this.subscription.unsubscribe();
      // complete observable on dialog close
      this.itemToggledInCollection$.complete();
    });

    // return observable
    return this.itemToggledInCollection$;
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

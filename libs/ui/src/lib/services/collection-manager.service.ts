import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

// mock component
@Component({
  selector: 'campus-manage-collection',
  template: ``
})
export class ManageCollectionComponent {
  @Output() selectionChanged = new EventEmitter<{
    relatedItem: ManageCollectionItemInterface;
    item: ManageCollectionItemInterface;
    selected: boolean;
  }>();
  constructor() {}
}
// TODO: remove
class ItemToggledInCollectionEvent {}

// TODO: remove
interface ManageCollectionItemInterface {
  icon?: string;
  label: string;
  id: number;
  className?: string;
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
  private itemToggledInCollection$ = new Subject<any>();

  constructor(public dialog: MatDialog) {}

  manageCollections(
    item: ManageCollectionItemInterface,
    linkableItems: ManageCollectionItemInterface[],
    linkedItemIds: number[],
    recentItemIds: number[]
  ): Observable<ItemToggledInCollectionEvent> {
    // open dialog
    const dialogData: ManageCollectionsForContentDataInterface = {
      title: '',
      item: item,
      linkableItems: linkableItems,
      linkedItemIds: new Set(linkedItemIds),
      recentItemIds: new Set(recentItemIds)
    };

    const dialogRef = this.openDialog(dialogData);

    // listen to component and bubble itemToggledInCollectionEvent
    this.subscription = dialogRef.componentInstance.selectionChanged
      .pipe(
        map(itemToggleEvent =>
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
    return of(new ItemToggledInCollectionEvent());
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

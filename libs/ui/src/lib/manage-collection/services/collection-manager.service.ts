import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ManageCollectionsDataInterface } from '../../manage-collection/interfaces/manage-collection-data.interface';
import { ManageCollectionItemInterface } from '../../manage-collection/interfaces/manage-collection-item.interface';
import { ManageCollectionComponent } from '../../manage-collection/manage-collection.component';
import { EnvironmentUIInterface, ENVIRONMENT_UI_TOKEN } from '../../tokens';
import { ItemToggledInCollectionInterface } from '../interfaces/item-toggled-in-collection.interface';
import { CollectionManagerServiceInterface } from './collection-manager.service.interface';

@Injectable({
  providedIn: 'root'
})
export class CollectionManagerService
  implements CollectionManagerServiceInterface {
  constructor(
    private dialog: MatDialog,
    @Inject(ENVIRONMENT_UI_TOKEN)
    private environmentUiToken: EnvironmentUIInterface
  ) {}

  manageCollections(
    title: string,
    item: ManageCollectionItemInterface,
    linkableItems: ManageCollectionItemInterface[],
    linkedItemIds: number[],
    recentItemIds: number[],
    collectionType: string
  ): Observable<ItemToggledInCollectionInterface> {
    // setup observable
    const itemToggledInCollection$ = new Subject<
      ItemToggledInCollectionInterface
    >();

    let subscription: Subscription;

    // open dialog
    const dialogData: ManageCollectionsDataInterface = {
      title: title,
      item: item,
      linkableItems: linkableItems,
      linkedItemIds: new Set(linkedItemIds),
      recentItemIds: new Set(recentItemIds),
      collectionType: collectionType
    };

    const dialogRef = this.openDialog(dialogData);

    // listen to component and bubble itemToggledInCollectionEvent
    subscription = dialogRef.componentInstance.selectionChanged.subscribe(
      (itemToggleEvent: ItemToggledInCollectionInterface) =>
        itemToggledInCollection$.next(itemToggleEvent)
    );

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        // clean up subscription on dialog close
        subscription.unsubscribe();
        // complete observable on dialog close
        itemToggledInCollection$.complete();
      });

    // return observable
    return itemToggledInCollection$;
  }

  private openDialog(
    data: ManageCollectionsDataInterface
  ): MatDialogRef<ManageCollectionComponent> {
    // use the ManageCollectionComponent
    // inject the right data
    const config = {
      data,
      panelClass: this.environmentUiToken.useModalSideSheetStyle
        ? 'ui-modal-side-sheet'
        : 'ui-manage-collection__dialog',
      position: this.environmentUiToken.useModalSideSheetStyle
        ? { top: '0', right: '0' }
        : {}
    };
    return this.dialog.open(ManageCollectionComponent, config);
  }
}

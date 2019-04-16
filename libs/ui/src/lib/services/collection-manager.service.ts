import { Component, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// mock component
@Component({
  selector: 'campus-manage-collection',
  template: ``
})
export class ManageCollectionComponent {
  constructor() {}
}

class ItemToggledInCollectionEvent {}

@Injectable({
  providedIn: 'root'
})
export class CollectionManagerService {
  constructor() {}

  manageCollections(
    item: ManageCollectionItemInterface,
    linkableItems: ManageCollectionItemInterface,
    linkedItemIds: number[],
    recentItemIds: number[]
  ): Observable<ItemToggledInCollectionEvent> {
    // open dialog
    // use the ManageCollectionComponent
    // inject the right data
    // listen to component and bubble itemToggledInCollectionEvent
    // clean up subscription on dialog close
    // complete observable on dialog close

    // return observable
    return of(new ItemToggledInCollectionEvent());
  }
}

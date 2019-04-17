import { Component, EventEmitter, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { hot } from '@nrwl/nx/testing';
import { of } from 'rxjs';
import { ManageCollectionItemFixture } from '../manage-collection/fixtures/ManageCollectionItem.fixture';
import {
  CollectionManagerService,
  CollectionMangerInterface,
  ManageCollectionsForContentDataInterface
} from './collection-manager.service';
import { ItemToggledInCollectionInterface } from './ItemToggledInCollection.interface';

const mockData: ManageCollectionsForContentDataInterface = {
  title: 'bar',
  item: new ManageCollectionItemFixture(),
  linkableItems: [
    new ManageCollectionItemFixture({ id: 2 }),
    new ManageCollectionItemFixture({ id: 3 })
  ],
  linkedItemIds: new Set([1, 2, 3, 4]),
  recentItemIds: new Set([1, 2, 7, 9])
};

const mockSelectionChangedData: ItemToggledInCollectionInterface = {
  relatedItem: new ManageCollectionItemFixture({ id: 2 }),
  item: new ManageCollectionItemFixture({ id: 1 }),
  selected: true
};

@Component({
  selector: 'campus-manage-collection',
  template: ``
})
export class ManageCollectionComponent {
  @Output() selectionChanged = new EventEmitter<
    ItemToggledInCollectionInterface
  >();
}

describe('CollectionManagerService', () => {
  let service: CollectionMangerInterface;
  let matDialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: () => {
              return {
                componentInstance: {
                  selectionChanged: of(mockSelectionChangedData)
                },
                afterClosed: () => of('')
              };
            }
          }
        }
      ]
    });

    service = TestBed.get(CollectionManagerService);
    matDialog = TestBed.get(MatDialog);
  });

  it('should be created', () => {
    const service: CollectionManagerService = TestBed.get(
      CollectionManagerService
    );
    expect(service).toBeTruthy();
  });

  describe('manageCollection()', () => {
    it('should open a dialog with the ManageCollectionComponent and correct data', () => {
      const openSpy = jest.spyOn(matDialog, 'open');

      service.manageCollections(
        mockData.title,
        mockData.item,
        mockData.linkableItems,
        [1, 2, 3, 4],
        [1, 2, 7, 9]
      );

      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openSpy).toHaveBeenCalledWith(expect.any(Function), {
        data: {
          title: mockData.title,
          item: mockData.item,
          linkableItems: mockData.linkableItems,
          linkedItemIds: new Set(mockData.linkedItemIds),
          recentItemIds: new Set(mockData.recentItemIds)
        }
      });
    });

    it('should return an observable', () => {
      const expected = hot('a', { a: mockSelectionChangedData });
      const result = service.manageCollections(
        mockData.title,
        mockData.item,
        mockData.linkableItems,
        [1, 2, 3, 4],
        [1, 2, 7, 9]
      );

      expect(result).toBeObservable();
    });
  });
});

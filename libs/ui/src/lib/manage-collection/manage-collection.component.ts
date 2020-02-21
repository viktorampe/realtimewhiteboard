import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  MatDialogRef,
  MatSelectionList,
  MatSelectionListChange,
  MAT_DIALOG_DATA
} from '@angular/material';
import { Router } from '@angular/router';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FilterTextInputComponent } from '../filter-text-input/filter-text-input.component';
import {
  EnvironmentCollectionManagementFeatureInterface,
  EnvironmentUIInterface,
  ENVIRONMENT_COLLECTION_MANAGEMENT_FEATURE_TOKEN,
  ENVIRONMENT_UI_TOKEN
} from '../tokens';
import { ItemToggledInCollectionInterface } from './interfaces/item-toggled-in-collection.interface';
import { ManageCollectionsDataInterface } from './interfaces/manage-collection-data.interface';
import { ManageCollectionItemInterface } from './interfaces/manage-collection-item.interface';

@Component({
  selector: 'campus-manage-collection',
  templateUrl: './manage-collection.component.html',
  styleUrls: ['./manage-collection.component.scss']
})
export class ManageCollectionComponent
  implements OnInit, AfterViewInit, OnDestroy {
  public recentLinkableItems: ManageCollectionItemInterface[];
  public linkableItems: ManageCollectionItemInterface[];

  // needed to selected items after filtering
  private selectedIds: Set<number>;
  private subscriptions = new Subscription();

  public useFilter: boolean;
  public asModalSideSheet: boolean;

  _filterTextInput: FilterTextInputComponent<
    ManageCollectionItemInterface[],
    ManageCollectionItemInterface
  >;

  _selectionList: MatSelectionList;

  @Output() selectionChanged = new EventEmitter<
    ItemToggledInCollectionInterface
  >();

  @ViewChild(MatSelectionList, { static: false })
  set selectionList(list: MatSelectionList) {
    if (list) {
      this._selectionList = list;
    }
  }

  @ViewChild(FilterTextInputComponent, { static: false })
  set filterTextInput(
    filter: FilterTextInputComponent<
      ManageCollectionItemInterface[],
      ManageCollectionItemInterface
    >
  ) {
    if (filter) {
      this._filterTextInput = filter;
      this._filterTextInput.setFilterableItem(this);
    }
  }

  @HostBinding('class.ui-manage-collection')
  get isManageCollectionClass() {
    return true;
  }
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ManageCollectionsDataInterface,
    @Inject(FILTER_SERVICE_TOKEN) private filterService: FilterServiceInterface,
    private cd: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ManageCollectionComponent>,
    @Inject(ENVIRONMENT_UI_TOKEN) environmentUiToken: EnvironmentUIInterface,
    @Inject(ENVIRONMENT_COLLECTION_MANAGEMENT_FEATURE_TOKEN)
    environmentCollectionManagementFeatureToken: EnvironmentCollectionManagementFeatureInterface,
    private router: Router
  ) {
    this.linkableItems = data.linkableItems;
    this.recentLinkableItems = data.linkableItems.filter(item =>
      data.recentItemIds.has(item.id)
    );

    this.selectedIds = data.linkedItemIds;
    this.useFilter = environmentCollectionManagementFeatureToken.useFilter;
    this.asModalSideSheet = !!environmentUiToken.useModalSideSheetStyle; // default false for backward compatibility
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this._selectionList) {
      this.subscriptions.add(
        // when options change i.e. after filtering
        // re-set selection
        this._selectionList.options.changes
          .pipe(startWith(null as any)) // emit once on init
          .subscribe(() => {
            this.selectListItems(this.selectedIds);
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onSelectionChanged(event: MatSelectionListChange) {
    const changedItemId = event.option.value;

    if (event.option.selected) {
      this.selectedIds.add(changedItemId);
    } else {
      this.selectedIds.delete(changedItemId);
    }
    // if item appears twice in list
    // also select/deselect other one
    // this does not trigger a new onSelectionChanged
    event.source.options
      .filter(listItem => listItem.value === changedItemId)
      .forEach(listItem => (listItem.selected = event.option.selected));

    // find changed item
    const changedItem = this.data.linkableItems.find(
      item => item.id === changedItemId
    );

    this.selectionChanged.emit({
      item: this.data.item,
      relatedItem: changedItem,
      selected: event.option.selected
    });
  }

  public onCloseButtonClick() {
    this.dialogRef.close();
  }

  filterFn(
    source: ManageCollectionItemInterface[],
    searchText: string
  ): ManageCollectionItemInterface[] {
    const filteredItems = this.filterService.filter(source, {
      label: searchText
    });
    return filteredItems;
  }

  private selectListItems(ids: Set<number>) {
    this._selectionList.options
      .filter(listItem => ids.has(listItem.value))
      .forEach(listItem => (listItem.selected = true));

    this.cd.detectChanges();
  }

  navigateTo(event: MouseEvent, link: string) {
    event.stopPropagation();
    this.router.navigateByUrl(link);
    this.dialogRef.close();
  }
}

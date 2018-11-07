import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  BundleInterface,
  ContentInterface,
  LearningAreaInterface,
  PersonInterface
} from '@campus/dal';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SideSheetComponent
} from '@campus/ui';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FilterService } from '../bundles.filter';
import { BundlesViewModel } from '../bundles.viewmodel';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  protected listFormat = ListFormat; //enum beschikbaar maken in template

  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;

  learningArea$: Observable<LearningAreaInterface> = this.bundlesViewModel
    .activeLearningArea$;
  bundle$: Observable<BundleInterface> = this.bundlesViewModel.activeBundle$;
  bundleOwner$: Observable<PersonInterface> = this.bundlesViewModel
    .activeBundleOwner$;
  contents$: Observable<ContentInterface[]> = this.bundlesViewModel
    .activeBundleContents$;

  contentForInfoPanelSingle$: Observable<ContentInterface>;
  contentForInfoPanelMultiple$: Observable<ContentInterface[]>;

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<ContentInterface, ContentInterface>;

  list: ListViewComponent;
  @ViewChild('bundleListview')
  set listViewComponent(list: ListViewComponent) {
    this.list = list;
  }
  private sideSheet: SideSheetComponent;
  @ViewChild('bundleSidesheet')
  set sideSheetComponent(sidesheet: SideSheetComponent) {
    this.sideSheet = sidesheet;
  }

  private subscriptions = new Subscription();

  constructor(
    public bundlesViewModel: BundlesViewModel,
    private filterService: FilterService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filterTextInput.filterFn = this.filterFn.bind(this);
  }

  ngAfterViewInit(): void {
    this.contentForInfoPanelSingle$ = this.list.selectedItems$.pipe(
      filter(items => items.length === 1),
      map(items => items[0].dataObject)
    );

    this.contentForInfoPanelMultiple$ = this.list.selectedItems$.pipe(
      filter(items => items.length > 1),
      map(items => items.map(i => i.dataObject))
    );

    this.subscriptions.add(
      this.list.selectedItems$.subscribe(selectedItems => {
        if (selectedItems.length > 0) {
          this.sideSheet.toggle(true);
        }
      })
    );
    this.subscriptions.add(
      this.filterTextInput.result$.subscribe(() => this.list.deselectAllItems())
    );

    // Needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(this.listFormat[value]);
  }

  private filterFn(
    info: ContentInterface[],
    searchText: string
  ): ContentInterface[] {
    return this.filterService.filter(info, {
      name: searchText
    });
  }
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { BundleInterface, ContentInterface } from '@campus/dal';
import { ListFormat, ListViewComponent, SideSheetComponent } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  learningArea$ = this.bundlesViewModel.activeLearningArea$;
  bundle$ = this.bundlesViewModel.activeBundle$;
  bundleOwner$ = this.bundlesViewModel.activeBundleOwner$;
  contents$ = this.bundlesViewModel.activeBundleContents$;

  isReady$ = new BehaviorSubject(false);

  listFormat = ListFormat; //enum beschikbaar maken in template
  currentListFormat$ = this.bundlesViewModel.listFormat$;

  filterInput$ = new BehaviorSubject<string>('');
  filteredContents$: Observable<ContentInterface[]>;

  contentForInfoPanelEmpty$: Observable<BundleInterface>;
  contentForInfoPanelSingle$: Observable<ContentInterface>;
  contentForInfoPanelMultiple$: Observable<ContentInterface[]>;

  private subscriptions = new Subscription();

  private list: ListViewComponent;
  @ViewChild('bundleListview')
  set listViewComponent(list: ListViewComponent) {
    this.list = list;
  }
  private sideSheet: SideSheetComponent;
  @ViewChild('bundleSidesheet')
  set sideSheetComponent(sidesheet: SideSheetComponent) {
    this.sideSheet = sidesheet;
  }

  constructor(
    public bundlesViewModel: BundlesViewModel,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.contentForInfoPanelEmpty$ = this.bundle$;
    this.filteredContents$ = this.filterContents(
      this.contents$,
      this.filterInput$
    );
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
      this.filteredContents$.subscribe(() => this.list.deselectAllItems())
    );

    // Needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clickChangeListFormat(value: string): void {
    this.bundlesViewModel.changeListFormat(ListFormat[value]);
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  filterContents(
    contents$: Observable<ContentInterface[]>,
    filterInput$: Observable<string>
  ): Observable<ContentInterface[]> {
    return combineLatest(contents$, filterInput$).pipe(
      map(([contents, filterInput]: [ContentInterface[], string]) =>
        this.bundlesViewModel.filterArray(contents, 'name', filterInput)
      )
    );
  }
}

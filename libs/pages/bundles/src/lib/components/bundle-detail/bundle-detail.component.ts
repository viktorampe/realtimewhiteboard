import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { BundleInterface, ContentInterface } from '@campus/dal';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  SideSheetComponent
} from '@campus/ui';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { BundleDetailViewModel } from './bundle-detail.viewmodel';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  bundle$ = this.vm.selectedBundle$;
  contents$ = this.vm.bundleContents$;
  listFormat = ListFormat; //enum beschikbaar maken in template
  currentListFormat$ = this.vm.listFormat$;

  filteredContents$: Observable<ContentInterface[]>;

  contentForInfoPanelEmpty$: Observable<BundleInterface>;
  contentForInfoPanelSingle$: Observable<ContentInterface>;
  contentForInfoPanelMultiple$: Observable<ContentInterface[]>;

  private subscriptions = new Subscription();

  @ViewChild(ListViewComponent) list: ListViewComponent;
  @ViewChild(SideSheetComponent) sideSheet: SideSheetComponent;
  @ViewChild(FilterTextInputComponent) filter: FilterTextInputComponent;

  constructor(
    public vm: BundleDetailViewModel,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.contentForInfoPanelEmpty$ = this.bundle$;

    this.setupFilteredContentStream();
  }

  ngAfterViewInit() {
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

  setListFormat(format: ListFormat) {
    this.vm.listFormat$.next(format);
  }

  private setupFilteredContentStream() {
    return (this.filteredContents$ = combineLatest(
      this.contents$,
      this.filter.filterTextChange.pipe(startWith(''))
    ).pipe(
      map(([contents, filterText]) =>
        contents.filter(c =>
          c.name.toLowerCase().includes(filterText.toLowerCase())
        )
      )
    ));
  }
}

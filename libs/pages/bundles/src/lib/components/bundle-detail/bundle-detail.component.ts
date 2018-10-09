import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  ListViewItemDirective,
  SideSheetComponent
} from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Content } from './bundle-detail-classes';
import { BundleDetailViewModel } from './bundle-detail.viewmodel';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  // contents$: Observable<Content[]>;
  // teacher$: Observable<Teacher[]>;
  // filter$: Observable<string>;
  // listFormat$: Observable<ListFormat>;
  // selectedItems$: Observable<ListViewItemDirective[]>;
  // currentBundle$: Observable<Bundle>;

  subscriptions = new Subscription();
  bundle$ = this.vm.getMockBundle();
  contents$ = this.vm.getMockContents();
  filteredContents$: Observable<Content[]>;
  selectedItems: ListViewItemDirective[] = [];
  listFormat = ListFormat;
  currentListFormat$ = new BehaviorSubject<ListFormat>(ListFormat.GRID);

  public get selectedContent(): object {
    return (this.selectedItems[0]
      .dataObject as Content).transformToContentForInfoPanel();
  }

  public get selectedContents(): object[] {
    return this.selectedItems.map(x =>
      (x.dataObject as Content).transformToContentsForInfoPanel()
    );
  }

  @ViewChild(ListViewComponent) list: ListViewComponent;
  @ViewChild(SideSheetComponent) sideSheet: SideSheetComponent;
  @ViewChild(FilterTextInputComponent) filter: FilterTextInputComponent;

  constructor(
    public vm: BundleDetailViewModel,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.filteredContents$ = combineLatest(
      this.contents$,
      this.filter.text.pipe(startWith(''))
    ).pipe(
      map(([contents, filterText]) =>
        contents.filter(c =>
          c.title.toLowerCase().includes(filterText.toLowerCase())
        )
      )
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.list.selectedItems$.subscribe(x => {
        if (x.length > 0) {
          this.sideSheet.toggle(true);
        }
        this.selectedItems = x;
      })
    );
    this.subscriptions.add(
      this.filteredContents$.subscribe(() => this.list.deselectAllItems())
    );

    // Nodig om ExpressionChangedAfterItHasBeenCheckedError te vermijden
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setListFormat(format: ListFormat) {
    this.currentListFormat$.next(format);
  }
}

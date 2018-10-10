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
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { Content } from './bundle-detail-classes';
import { BundleDetailViewModel } from './bundle-detail.viewmodel';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions = new Subscription();
  bundle$ = this.vm.selectedBundle$;
  contents$ = this.vm.bundleContents$;
  filteredContents$: Observable<Content[]>;
  selectedItems: ListViewItemDirective[] = [];
  listFormat = ListFormat; //enum beschikbaar maken in template
  currentListFormat$ = this.vm.listFormat$;

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
      tap(() => {
        console.log(this.contents$);
      }),
      map(([contents, filterText]) =>
        contents.filter(c =>
          c.name.toLowerCase().includes(filterText.toLowerCase())
        )
      )
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.list.selectedItems$.subscribe(selectedItems => {
        if (selectedItems.length > 0) {
          this.sideSheet.toggle(true);
        }
        this.selectedItems = selectedItems;
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
    this.vm.listFormat$.next(format);
  }
}

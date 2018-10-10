import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ContentInterface } from '@campus/dal';
import {
  FilterTextInputComponent,
  ListFormat,
  ListViewComponent,
  ListViewItemDirective,
  SideSheetComponent
} from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { BundleDetailViewModel } from './bundle-detail.viewmodel';
import { InfoPanelDataConverterService } from './services/info-panel-data-converter.service';

@Component({
  selector: 'campus-bundle-detail',
  templateUrl: './bundle-detail.component.html',
  styleUrls: ['./bundle-detail.component.scss']
})
export class BundleDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions = new Subscription();
  bundle$ = this.vm.selectedBundle$;
  contents$ = this.vm.bundleContents$;
  filteredContents$: Observable<ContentInterface[]>;
  selectedItems$ = new BehaviorSubject<ListViewItemDirective[]>([]);
  listFormat = ListFormat; //enum beschikbaar maken in template
  currentListFormat$ = this.vm.listFormat$;

  contentForInfoPanelSingle$ = this.selectedItems$.pipe(
    filter(items => items.length === 1),
    map(items => items[0].dataObject as ContentInterface),
    map(data =>
      this.infoPanelDataConverter.transformToContentForInfoPanel(data)
    )
  );

  contentForInfoPanelMultiple$ = this.selectedItems$.pipe(
    filter(items => items.length > 1),
    map(items => items.map(i => i.dataObject as ContentInterface)),
    map(dataArray =>
      this.infoPanelDataConverter.transformToContentsForInfoPanel(dataArray)
    )
  );

  @ViewChild(ListViewComponent) list: ListViewComponent;
  @ViewChild(SideSheetComponent) sideSheet: SideSheetComponent;
  @ViewChild(FilterTextInputComponent) filter: FilterTextInputComponent;

  constructor(
    public vm: BundleDetailViewModel,
    private cd: ChangeDetectorRef,
    public infoPanelDataConverter: InfoPanelDataConverterService
  ) {}

  ngOnInit() {
    this.filteredContents$ = combineLatest(
      this.contents$,
      this.filter.text.pipe(startWith(''))
    ).pipe(
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
        this.selectedItems$.next(selectedItems);
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

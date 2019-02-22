import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { auditTime, filter } from 'rxjs/operators';
import {
  SearchModeInterface,
  SearchResultInterface,
  SearchResultItemInterface,
  SearchStateInterface,
  SortModeInterface
} from '../../interfaces';

// https://angular.io/guide/dynamic-component-loader

@Directive({
  selector: '[campusResultListHost], [result-list-host]'
})
export class ResultListDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

/**
 * Usage:
 * - Create a new component `MyResultItemComponent` in your app to display a result
 * - Let the component implement `SearchResultItemInterface`:
 *     requires an `@Input() data: MyResultInterface;`
 * - Add the component to your NgModule with `entryComponents: [MyResultItemComponent]`
 *
 * @example
 * component:
 *   resultsPage: SearchResultInterface<MyResultInterface>;
 *   myResultItemComponent: Type<SearchResultItemInterface> = MyResultItemComponent;
 *
 * template:
 *   <campus-results-list
 *     [resultsPage]="resultsPage$ | async"
 *     [resultItem]="myResultItemComponent"
 *     [searchMode]="searchMode"
 *     [searchState]="searchState$ | async"
 *     (sortBy)="onSortChanged($event)"
 *     (getNextPage)="onGetNextPage($event)"
 *   ></campus-results-list>
 * @example
 */
@Component({
  selector: 'campus-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnInit, OnDestroy, AfterViewInit {
  public selected: any;
  public count = 0;
  public sortModes: SortModeInterface[];
  public activeSortMode: string;

  private subscriptions: Subscription = new Subscription();
  private loadedCount = 0;
  private clearResults = true;
  private disableInfiniteScroll = true;
  private componentFactory: ComponentFactory<SearchResultItemInterface>;
  private _searchState: SearchStateInterface = {
    searchTerm: null,
    filterCriteriaSelections: new Map(),
    from: 0
  };

  @Input() searchMode: SearchModeInterface;
  @Input() itemSize = 100;

  @Input()
  set resultItem(resultItem: Type<SearchResultItemInterface>) {
    // prepare factory to create result item component
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      resultItem
    );
  }

  @Input()
  set searchState(searchState: SearchStateInterface) {
    if (searchState) {
      this._searchState = searchState;
      this.setSearchState(searchState);
    }
  }
  get searchState() {
    return this._searchState;
  }

  @Input()
  set resultsPage(searchResult: SearchResultInterface<any>) {
    console.log('new resultsPage', searchResult);
    if (searchResult) {
      this.count = searchResult.count;
      this.loadComponent(searchResult.results);
    }
  }

  @Output() sortBy: EventEmitter<SortModeInterface> = new EventEmitter();
  @Output() getNextPage: EventEmitter<number> = new EventEmitter();

  @ViewChild(ResultListDirective) resultListHost: ResultListDirective;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(
    private ngZone: NgZone,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.sortModes = this.searchMode.results.sortModes;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.viewPort
        .elementScrolled()
        .pipe(
          filter(() => !this.disableInfiniteScroll),
          auditTime(300) // limit events to once every 300ms
        )
        .subscribe(() => {
          const fromBottom = this.viewPort.measureScrollOffset('bottom');
          console.log('scrolled', fromBottom, 'from bottom');
          if (fromBottom <= 4 * this.itemSize) {
            // disable multiple event triggers for the same page
            this.disableInfiniteScroll = true;
            // ask to load next page of results
            // ngZone is required to trigger change detection, it seems to be a similiar issue as this:
            // https://github.com/angular/material2/issues/12869#issuecomment-416734670
            // where the `elementScrolled` event is emitting outside the ngZone
            this.ngZone.run(() => this.getNextPage.next(this.loadedCount + 1));
          }
        })
    );
  }

  clickSortMode(sortMode: SortModeInterface): void {
    if (this.activeSortMode !== sortMode.name) {
      this.activeSortMode = sortMode.name;
      this.searchState.sort = sortMode.name;
      this.sortBy.next(sortMode);
    }
  }

  private setSearchState(searchState: SearchStateInterface): void {
    if (!searchState.from) {
      this.clearResults = true;
      this.disableInfiniteScroll = true;
    }
    if (searchState.sort) {
      this.activeSortMode = searchState.sort;
    } else {
      this.activeSortMode = this.searchMode.results.sortModes[0].name;
    }
  }

  private loadComponent(results: any[]): void {
    if (results.length === 0) {
      // disable scroll event when there are no more results
      this.disableInfiniteScroll = true;
      return;
    }

    if (this.clearResults) {
      this.clearResultList();
    }
    results.forEach(result => this.addResultItemComponent(result));

    this.loadedCount += results.length;
    // re-enable scroll trigger
    this.disableInfiniteScroll = false;
  }

  private addResultItemComponent(result): void {
    const componentRef = this.resultListHost.viewContainerRef.createComponent(
      this.componentFactory
    );
    (componentRef.instance as SearchResultItemInterface).data = result;
  }

  private clearResultList() {
    this.resultListHost.viewContainerRef.clear();
    this.loadedCount = 0;
    this.clearResults = false;
  }
}

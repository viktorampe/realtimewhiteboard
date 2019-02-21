import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
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
 *     [resultsPage]="resultsPage"
 *     [resultItem]="myResultItemComponent"
 *     [searchFilterCriteria]="selectFilter">
 *   </campus-results-list>
 * @example
 */
@Component({
  selector: 'campus-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})
export class ResultsListComponent implements OnInit {
  public selected: any;
  public count = 0;
  public sortModes: SortModeInterface[];
  public activeSortMode: string;
  private clearResults = true;
  private disableInfiniteScroll = true;
  private componentFactory: ComponentFactory<SearchResultItemInterface>;
  private pageSize: number;
  private _searchState: SearchStateInterface;

  @Input() resultItem: Type<SearchResultItemInterface>;
  @Input() searchMode: SearchModeInterface;

  @Input()
  get searchState() {
    return this._searchState;
  }
  set searchState(searchState: SearchStateInterface) {
    this._searchState = searchState;
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
  @Input()
  set resultsPage(searchResult: SearchResultInterface<any>) {
    if (!searchResult) {
      return;
    }
    this.count = searchResult.count;
    this.loadComponent(searchResult.results);
  }

  @Output() sort: EventEmitter<SortModeInterface> = new EventEmitter();
  @Output() scroll: EventEmitter<number> = new EventEmitter();

  @ViewChild(ResultListDirective) resultListHost: ResultListDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.sortModes = this.searchMode.results.sortModes;
    this.pageSize = this.searchMode.results.pageSize;
  }

  clickSortMode(sortMode: SortModeInterface) {
    if (this.activeSortMode !== sortMode.name) {
      this.activeSortMode = sortMode.name;
      this.searchState.sort = sortMode.name;
      this.sort.next(sortMode);
    }
  }

  private loadComponent(results: any[]) {
    if (results.length === 0) {
      this.disableInfiniteScroll = true;
      return;
    }

    if (!this.componentFactory) {
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.resultItem
      );
    }
    if (this.clearResults) {
      this.resultListHost.viewContainerRef.clear();
      this.clearResults = false;
      this.disableInfiniteScroll = false;
    }
    results.forEach(result => this.addResultItemComponent(result));
  }

  private addResultItemComponent(result) {
    const componentRef = this.resultListHost.viewContainerRef.createComponent(
      this.componentFactory
    );
    (componentRef.instance as SearchResultItemInterface).data = result;
  }
}

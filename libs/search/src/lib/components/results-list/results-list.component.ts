import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { WINDOW } from '@campus/browser';
import { SearchResultInterface, SearchStateInterface } from '@campus/dal';
import { ListViewComponent } from '@campus/ui';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SearchModeInterface, SortModeInterface } from '../../interfaces';
import { SearchResultItemComponentInterface } from './../../interfaces/search-result-interface';

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
 * - Let the component extend `ResultItemBase`:
 *     requires an `@Input() data: MyResultInterface;`
 * - Add the component to your NgModule with `entryComponents: [MyResultItemComponent]`
 *
 * @example
 * component:
 *   resultsPage: SearchResultInterface;
 *   myResultItemComponent: Type<SearchResultItemInterface> = MyResultItemComponent;
 *
 * template:
 *   <campus-results-list
 *     [resultsPage]="resultsPage$ | async"
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
export class ResultsListComponent implements OnDestroy, AfterViewInit {
  public count = 0;
  public sortModes: SortModeInterface[];
  public activeSortMode: string;
  public loading = false;

  private subscriptions: Subscription = new Subscription();
  private clearResultsTimer: number;
  private scrollEnabled = false;
  private componentFactory: ComponentFactory<
    SearchResultItemComponentInterface
  >;
  private _searchMode: SearchModeInterface;

  @Input() itemSize = 100;
  @Input()
  set searchMode(searchMode: SearchModeInterface) {
    if (searchMode) {
      this._searchMode = searchMode;
      this.initialize();
    }
  }
  get searchMode() {
    return this._searchMode;
  }

  @Input()
  set searchState(searchState: SearchStateInterface) {
    if (searchState) {
      this.updateViewFromSearchState(searchState);
    }
  }

  @Input()
  set resultsPage(searchResult: SearchResultInterface) {
    if (searchResult) {
      this.count = searchResult.count;
      this.addResults(searchResult.results);
    }
  }

  @Output() sortBy: EventEmitter<SortModeInterface> = new EventEmitter();
  @Output() getNextPage: EventEmitter<any> = new EventEmitter();

  @ViewChild(ResultListDirective) resultListHost: ResultListDirective;
  @ViewChild(ListViewComponent) listview: ListViewComponent<any>;
  @ViewChild(CdkScrollable) viewPort: CdkScrollable;

  constructor(
    private ngZone: NgZone,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(WINDOW) private nativeWindow: Window
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.viewPort
        .elementScrolled()
        .pipe(filter(() => this.scrollEnabled))
        .subscribe(() => {
          // ngZone is required to trigger change detection, because the `elementScrolled`
          // event is emitting outside the ngZone
          // this makes sense, because we don't want to trigger CD for each scroll event
          this.ngZone.run(() => this.checkForMoreResults());
        })
    );
  }

  sortModeClicked(sortMode: SortModeInterface): void {
    if (this.activeSortMode !== sortMode.name) {
      this.sortBy.emit(sortMode);
    }
  }

  private initialize(): void {
    this.sortModes = this.searchMode.results.sortModes;
    if (!this.activeSortMode) {
      // default sortMode if not set by searchState
      this.activeSortMode = this.sortModes[0].name;
    }
    if (!this.componentFactory) {
      // prepare factory to create result item component
      this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.searchMode.results.component
      );
    }
  }

  private updateViewFromSearchState(searchState: SearchStateInterface): void {
    this.scrollEnabled = false;
    if (searchState.from === undefined || searchState.from === null) {
      // no search running
      this.clearResults();
      this.loading = false;
    } else if (searchState.from === 0) {
      this.loading = true;
      if (this.clearResultsTimer) {
        // a new search was triggered before the previous results arrived
        this.nativeWindow.clearInterval(this.clearResultsTimer);
      }
      // UX: don't clear results immediately to avoid flicker effects
      this.clearResultsTimer = this.nativeWindow.setTimeout(() => {
        this.clearResults();
      }, 1000);
    }

    if (searchState.sort) {
      this.activeSortMode = searchState.sort;
    }
  }

  private addResults(results: any[]): void {
    if (this.clearResultsTimer) {
      this.clearResults();
    }
    if (results.length === 0) {
      this.loading = false;
      return;
    }

    // update template
    results.forEach(result => this.createResultComponent(result));

    // update private state variables
    this.scrollEnabled = true;

    // in case there's no scrollbar yet, we should manually trigger search
    // until we can handle scroll events
    this.nativeWindow.setTimeout(() => {
      // wrap in setTimeout to assure resultsHost size is updated when we measure the scroll offset
      this.checkForMoreResults();
    });
  }

  private createResultComponent(result): void {
    const componentRef = this.resultListHost.viewContainerRef.createComponent(
      this.componentFactory
    );
    const resultItem = componentRef.instance as SearchResultItemComponentInterface;
    resultItem.data = result;
    resultItem.listRef = this.listview;
  }

  private clearResults() {
    if (this.clearResultsTimer) {
      // cancel timer when results loaded before timeout
      this.nativeWindow.clearTimeout(this.clearResultsTimer);
      this.clearResultsTimer = null;
    }
    if (this.listview) this.listview.resetItems();
    if (this.resultListHost) this.resultListHost.viewContainerRef.clear();
  }

  private checkForMoreResults(): void {
    const fromBottom = this.viewPort.measureScrollOffset('bottom');
    if (fromBottom <= 4 * this.itemSize) {
      // disable multiple event triggers for the same page
      this.scrollEnabled = false;
      this.loading = true;
      // ask to load next page of results
      this.getNextPage.emit(null);
    }
  }
}

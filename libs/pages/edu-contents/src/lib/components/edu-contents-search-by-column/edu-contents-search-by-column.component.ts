import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable, Subscription } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents-search-by-column',
  templateUrl: './edu-contents-search-by-column.component.html',
  styleUrls: ['./edu-contents-search-by-column.component.scss']
})
export class EduContentSearchByColumnComponent
  implements AfterViewInit, OnDestroy, OnInit {
  public searchMode: SearchModeInterface;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public currentLearningArea: number;

  private subscriptions = new Subscription();

  @ViewChild(SearchComponent, { static: true })
  public searchComponent: SearchComponent;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;

  constructor(
    private eduContentsViewModel: EduContentsViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.searchMode = this.eduContentsViewModel.getSearchMode(
      this.activatedRoute.snapshot.routeConfig.path
    );
    this.initialSearchState$ = this.eduContentsViewModel.getInitialSearchState();
    this.searchState$ = this.eduContentsViewModel.searchState$;
    this.searchResults$ = this.eduContentsViewModel.searchResults$;
    this.currentLearningArea = this.activatedRoute.snapshot.params['area'];
  }

  onSearchStateChange(searchState: SearchStateInterface): void {
    this.eduContentsViewModel.updateState(searchState);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

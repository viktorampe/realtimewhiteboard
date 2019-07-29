import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EduContentTOCInterface } from '@campus/dal';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import { MethodViewModel } from '../method.viewmodel';

@Component({
  selector: 'campus-method-chapter',
  templateUrl: './method-chapter.component.html',
  styleUrls: ['./method-chapter.component.scss']
})
export class MethodChapterComponent implements OnInit, AfterViewInit {
  public searchMode: SearchModeInterface;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public lessonsForChapter$: Observable<EduContentTOCInterface[]>;

  private currentBookId: number;
  private currentChapterId: number;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(
    private methodViewModel: MethodViewModel,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchMode = this.methodViewModel.getSearchMode('chapter-lesson');
    this.initialSearchState$ = this.methodViewModel.getInitialSearchState();
    this.searchResults$ = this.methodViewModel.searchResults$;
    this.lessonsForChapter$ = this.methodViewModel.currentToc$;

    this.currentBookId = +this.route.snapshot.params.book;
    this.currentChapterId = +this.route.snapshot.params.chapter;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public onSearchStateChange(searchState: SearchStateInterface): void {
    this.methodViewModel.updateState(searchState);
  }

  public clearSearchFilters(): void {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, false);
    }
  }

  public clickOpenLesson(lessonId: number) {
    this.router.navigate([
      'methods',
      this.currentBookId,
      this.currentChapterId,
      lessonId
    ]);
  }

  public clickBackLink() {
    const urlParts = ['methods', this.currentBookId];
    this.router.navigate(urlParts);
  }
}

import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Router } from '@angular/router';
import { EduContentTOCInterface } from '@campus/dal';
import {
  SearchComponent,
  SearchModeInterface,
  SearchPortalDirective,
  SearchResultInterface,
  SearchStateInterface
} from '@campus/search';
import { Observable } from 'rxjs';
import {
  CurrentPracticeParams,
  PracticeViewModel
} from '../practice.viewmodel';

@Component({
  selector: 'campus-book-lessons',
  templateUrl: './book-lessons.component.html',
  styleUrls: ['./book-lessons.component.scss']
})
export class BookLessonsComponent implements AfterViewInit {
  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;

  public currentChapter$: Observable<EduContentTOCInterface>;
  public tocsForToc$: Observable<EduContentTOCInterface[]>;
  public currentPracticeParams$: Observable<CurrentPracticeParams>;

  @ViewChildren(SearchPortalDirective)
  private portalHosts: QueryList<SearchPortalDirective>;
  @ViewChild(SearchComponent) public searchComponent: SearchComponent;

  constructor(private viewModel: PracticeViewModel, private router: Router) {
    this.initialize();
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  clickOpenToc(bookId: number, chapterId: number, lessonId?: number) {
    const dynamicParams = [bookId, chapterId, lessonId].filter(Number);
    this.router.navigate(['/practice', ...dynamicParams]);
  }
  clickToBookChapters(bookId: number) {
    this.router.navigate(['/practice', bookId]);
  }

  clearSearchFilters(): void {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined);
    }
  }

  onSearchStateChange(searchState: SearchStateInterface): void {
    this.viewModel.updateState(searchState);
  }

  private initialize() {
    this.searchMode$ = this.viewModel.getSearchMode('practice-chapter-lesson');
    this.initialSearchState$ = this.viewModel.getInitialSearchState();
    this.searchResults$ = this.viewModel.searchResults$;

    this.currentChapter$ = this.viewModel.currentChapter$;
    this.tocsForToc$ = this.viewModel.chapterLessons$;
    this.currentPracticeParams$ = this.viewModel.currentPracticeParams$;
  }
}

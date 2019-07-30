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
  // providers: [{ provide: MethodViewModel, useClass: MockMethodViewModel }]
})
export class MethodChapterComponent implements OnInit, AfterViewInit {
  public searchMode$: Observable<SearchModeInterface>;
  public initialSearchState$: Observable<SearchStateInterface>;
  public searchResults$: Observable<SearchResultInterface>;
  public autoCompleteValues$: Observable<string[]>;
  public lessonsForChapter$: Observable<EduContentTOCInterface[]>;

  public currentLessonId: number;

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
    this.searchMode$ = this.methodViewModel.getSearchMode('chapter-lesson');
    this.initialSearchState$ = this.methodViewModel.getInitialSearchState();
    this.searchResults$ = this.methodViewModel.searchResults$;
    this.lessonsForChapter$ = this.methodViewModel.currentToc$;

    this.currentBookId = +this.route.snapshot.params.book;
    this.currentChapterId = +this.route.snapshot.params.chapter;
    this.currentLessonId = +this.route.snapshot.params.lesson;
  }

  ngAfterViewInit() {
    this.searchComponent.searchPortals = this.portalHosts;
  }

  public onAutoCompleteRequest(term: string) {
    this.autoCompleteValues$ = this.methodViewModel.requestAutoComplete(term);
  }

  public onSearchStateChange(searchState: SearchStateInterface): void {
    this.methodViewModel.updateState(searchState);
  }

  public clearSearchFilters(): void {
    if (this.searchComponent) {
      this.searchComponent.reset(undefined, true);
    }
  }

  public clickOpenLesson(lessonId: number) {
    this.currentLessonId = lessonId;

    this.router.navigate([
      'methods',
      this.currentBookId,
      this.currentChapterId,
      lessonId
    ]);
  }

  public clickBackLink() {
    const urlParts = ['methods', this.currentBookId];
    if (this.currentLessonId) urlParts.push(this.currentChapterId);
    this.router.navigate(urlParts);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { SearchModeInterface } from '@campus/search';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents-search-modes',
  templateUrl: './edu-contents-search-modes.component.html',
  styleUrls: ['./edu-contents-search-modes.component.scss']
})
export class EduContentSearchModesComponent implements OnInit {
  public learningArea$: Observable<LearningAreaInterface>;
  public searchTerm$: Subject<string>;
  public autoCompleteValues$: Observable<string[]>;

  public termMode: SearchModeInterface;
  public planMode: SearchModeInterface;
  public tocMode: SearchModeInterface;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eduContentsViewModel: EduContentsViewModel
  ) {}

  public ngOnInit(): void {
    this.learningArea$ = this.eduContentsViewModel.learningArea$;
    this.searchTerm$ = new Subject();
    this.autoCompleteValues$ = this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm =>
        this.eduContentsViewModel.requestAutoComplete(searchTerm)
      )
    );

    this.termMode = this.eduContentsViewModel.getSearchMode('term');
    this.planMode = this.eduContentsViewModel.getSearchMode('plan');
    this.tocMode = this.eduContentsViewModel.getSearchMode('toc');
  }

  public openSearchByTerm(searchTerm: string) {
    this.router.navigate(['term'], {
      relativeTo: this.route,
      queryParams: { searchTerm }
    });
  }

  public searchTermChanged(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }
}

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningAreaInterface } from '@campus/dal';
import { SearchModeInterface } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  switchMap
} from 'rxjs/operators';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents-search-modes',
  templateUrl: './edu-contents-search-modes.component.html',
  styleUrls: ['./edu-contents-search-modes.component.scss']
})
export class EduContentSearchModesComponent implements OnInit, OnDestroy {
  public autoCompleteValues: string[] = [];
  public learningArea$: Observable<LearningAreaInterface>;

  private searchTerm = new Subject<string>();
  private subscriptions = new Subscription();
  private routeParams$ = this.route.params.pipe(shareReplay(1));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eduContentsViewModel: EduContentsViewModel,
    @Inject(ENVIRONMENT_SEARCHMODES_TOKEN)
    public searchModes: { [key: string]: SearchModeInterface }
  ) {}

  public ngOnInit(): void {
    this.learningArea$ = this.getLearningArea();

    this.subscriptions.add(
      this.searchTerm
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap(searchTerm => this.getAutoCompleteValues(searchTerm))
        )
        .subscribe(
          (values: string[]): void => {
            this.autoCompleteValues = values;
          }
        )
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public openSearchByTerm(searchTerm: string) {
    this.router.navigate(['term'], {
      relativeTo: this.route,
      queryParams: { searchTerm }
    });
  }

  public searchTermChanged(searchTerm: string) {
    this.searchTerm.next(searchTerm);
  }

  private getAutoCompleteValues(searchTerm: string): Observable<string[]> {
    return this.eduContentsViewModel.requestAutoComplete(searchTerm);
  }

  private getLearningArea(): Observable<LearningAreaInterface> {
    return this.routeParams$.pipe(
      switchMap(params =>
        this.eduContentsViewModel.getLearningAreaById(+params.area)
      )
    );
  }
}

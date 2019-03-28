import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnvironmentSearchModesInterface } from '@campus/shared';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EduContentsViewModel } from '../edu-contents.viewmodel';

@Component({
  selector: 'campus-edu-contents',
  templateUrl: './edu-contents-learning-area-overview.component.html',
  styleUrls: ['./edu-contents-learning-area-overview.component.scss']
})
export class EduContentLearningAreaOverviewComponent implements OnInit {
  public searchModes: EnvironmentSearchModesInterface;
  public searchTerm$: Subject<string>;
  public autoCompleteValues$: Observable<string[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eduContentsViewModel: EduContentsViewModel
  ) {}

  public ngOnInit(): void {
    this.searchModes = this.eduContentsViewModel.searchModes;
    this.searchTerm$ = new Subject();
    this.autoCompleteValues$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm =>
        this.eduContentsViewModel.requestAutoComplete(searchTerm)
      )
    );
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

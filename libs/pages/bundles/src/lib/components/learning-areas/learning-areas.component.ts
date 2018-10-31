import { Component, OnInit } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';

@Component({
  selector: 'campus-learning-areas',
  templateUrl: './learning-areas.component.html',
  styleUrls: ['./learning-areas.component.scss']
})
export class LearningAreasComponent implements OnInit {
  listFormat$: Observable<ListFormat>;
  filterInput$ = new BehaviorSubject<string>('');

  learningAreas$: Observable<LearningAreaInterface[]> = this.bundlesViewModel
    .learningAreas$;

  displayedLearningAreas$: Observable<
    LearningAreaInterface[]
  > = this.getDisplayedLearningAreas$(this.learningAreas$, this.filterInput$);

  learningAreasCounts$: Observable<any> = this.bundlesViewModel
    .sharedLearningAreasCount$;
  sharedLearningAreas$: Observable<LearningAreaInterface[]>;

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.listFormat$ = this.bundlesViewModel.listFormat$;

    this.sharedLearningAreas$ = this.bundlesViewModel.sharedLearningAreas$;
    // TODO find out why learningarea name is not displayed
    this.displayedLearningAreas$ = this.getDisplayedLearningAreas$(
      this.sharedLearningAreas$,
      this.filterInput$
    );
    this.learningAreasCounts$ = this.bundlesViewModel.sharedLearningAreasCount$;
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  clickChangeListFormat(value: string): void {
    this.bundlesViewModel.changeListFormat(ListFormat[value]);
  }

  getDisplayedLearningAreas$(
    learningAreas$: Observable<LearningAreaInterface[]>,
    filterInput$: Observable<string>
  ): Observable<LearningAreaInterface[]> {
    return combineLatest(learningAreas$, filterInput$).pipe(
      map(([learningAreas, filterInput]: [LearningAreaInterface[], string]) => {
        if (!filterInput) {
          return learningAreas;
        }
        return learningAreas.filter(learningArea =>
          learningArea.name.toLowerCase().includes(filterInput.toLowerCase())
        );
      })
    );
  }
}

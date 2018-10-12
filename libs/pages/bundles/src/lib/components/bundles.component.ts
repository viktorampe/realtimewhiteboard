import { Component, OnInit } from '@angular/core';
import { LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from './bundles.viewmodel';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  toolbarFixed: boolean;

  listFormat$: Observable<ListFormat> = this.bundlesViewModel.listFormat$;
  filterInput$ = new BehaviorSubject<string>('');

  learningAreas$: Observable<LearningAreaInterface[]> = this.bundlesViewModel
    .learningAreas$;

  displayedLearningAreas$: Observable<
    LearningAreaInterface[]
  > = this.getDisplayedLearningAreas$(this.learningAreas$, this.filterInput$);

  learningAreasCounts$: Observable<any> = this.bundlesViewModel
    .sharedLearningAreasCount$;

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.toolbarFixed = true;
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
        if (!filterInput || filterInput === '') return learningAreas;
        return learningAreas.filter(learningArea =>
          learningArea.name.toLowerCase().includes(filterInput.toLowerCase())
        );
      })
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BundlesViewModel } from '../bundles.viewmodel';
import { LearningAreasWithBundlesInfo } from '../bundles.viewmodel.interfaces';

@Component({
  selector: 'campus-learning-areas',
  templateUrl: './learning-areas.component.html',
  styleUrls: ['./learning-areas.component.scss']
})
export class LearningAreasComponent implements OnInit {
  listFormat$: Observable<ListFormat>;
  filterInput$ = new BehaviorSubject<string>('');

  sharedInfo$: Observable<LearningAreasWithBundlesInfo>;
  filteredSharedInfo$: Observable<LearningAreasWithBundlesInfo>;

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.sharedLearningAreas$;
    this.filteredSharedInfo$ = this.filterLearningAreas(
      this.sharedInfo$,
      this.filterInput$
    );
  }

  clickChangeListFormat(value: string): void {
    this.bundlesViewModel.changeListFormat(ListFormat[value]);
  }

  onChangeFilterInput(filterInput: string): void {
    this.filterInput$.next(filterInput);
  }

  resetFilterInput(): void {
    this.filterInput$.next('');
  }

  filterLearningAreas(
    learningAreas$: Observable<LearningAreasWithBundlesInfo>,
    filterInput$: Observable<string>
  ): Observable<LearningAreasWithBundlesInfo> {
    return combineLatest(learningAreas$, filterInput$).pipe(
      map(([info, filterInput]: [LearningAreasWithBundlesInfo, string]) => ({
        ...info,
        learningAreas: this.bundlesViewModel.filterArray(
          info.learningAreas,
          'learningArea.name',
          filterInput
        )
      }))
    );
  }
}

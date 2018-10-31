import { Component, OnInit } from '@angular/core';
import { ListFormat } from '@campus/ui';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BundlesViewModel,
  LearningAreaWithBundleInstanceInfo
} from '../bundles.viewmodel';

@Component({
  selector: 'campus-learning-areas',
  templateUrl: './learning-areas.component.html',
  styleUrls: ['./learning-areas.component.scss']
})
export class LearningAreasComponent implements OnInit {
  listFormat$: Observable<ListFormat>;
  filterInput$ = new BehaviorSubject<string>('');

  sharedInfo$: Observable<LearningAreaWithBundleInstanceInfo>;
  filteredSharedInfo$: Observable<LearningAreaWithBundleInstanceInfo>;

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.sharedLearningAreas$;
    this.filteredSharedInfo$ = this.filterLearningAreas(
      this.sharedInfo$,
      this.filterInput$
    );
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

  filterLearningAreas(
    learningAreas$: Observable<LearningAreaWithBundleInstanceInfo>,
    filterInput$: Observable<string>
  ): Observable<LearningAreaWithBundleInstanceInfo> {
    return combineLatest(learningAreas$, filterInput$).pipe(
      map(
        ([info, filterInput]: [LearningAreaWithBundleInstanceInfo, string]) => {
          if (!filterInput) {
            return info;
          }
          return {
            ...info,
            learningAreas: info.learningAreas.filter(learningAreaInfo =>
              learningAreaInfo.learningArea.name
                .toLowerCase()
                .includes(filterInput.toLowerCase())
            )
          };
        }
      )
    );
  }
}

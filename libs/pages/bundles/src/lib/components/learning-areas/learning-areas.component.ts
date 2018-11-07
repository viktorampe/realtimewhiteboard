import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterService } from '../bundles.filter';
import { BundlesViewModel } from '../bundles.viewmodel';
import {
  LearningAreaInfoInterface,
  LearningAreasWithBundlesInfoInterface
} from '../bundles.viewmodel.interfaces';

@Component({
  selector: 'campus-learning-areas',
  templateUrl: './learning-areas.component.html',
  styleUrls: ['./learning-areas.component.scss']
})
export class LearningAreasComponent implements OnInit {
  protected listFormat = ListFormat;

  listFormat$: Observable<ListFormat>;
  filterInput$ = new BehaviorSubject<string>('');

  sharedInfo$: Observable<LearningAreasWithBundlesInfoInterface>;
  filteredSharedInfo$ = new BehaviorSubject<any[]>([]);

  @ViewChild(FilterTextInputComponent)
  filterTextInput: FilterTextInputComponent<
    LearningAreasWithBundlesInfoInterface,
    LearningAreaInfoInterface
  >;

  constructor(
    private bundlesViewModel: BundlesViewModel,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterTextInput.filterFn = this.filterFn.bind(this);
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.sharedLearningAreas$;
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(this.listFormat[value]);
  }

  private filterFn(
    info: LearningAreasWithBundlesInfoInterface,
    searchText: string
  ): LearningAreaInfoInterface[] {
    return this.filterService.filter(info.learningAreas, {
      learningArea: { name: searchText }
    });
  }
}

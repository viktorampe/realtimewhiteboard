import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterTextInputComponent, ListFormat } from '@campus/ui';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesViewModel } from '../bundles.viewmodel';
import { LearningAreasWithBundlesInfoInterface } from '../bundles.viewmodel.interfaces';

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
  filterTextInput: FilterTextInputComponent;

  constructor(private bundlesViewModel: BundlesViewModel) {}

  ngOnInit(): void {
    this.listFormat$ = this.bundlesViewModel.listFormat$;
    this.sharedInfo$ = this.bundlesViewModel.sharedLearningAreas$;
  }

  clickChangeListFormat(value: ListFormat): void {
    this.bundlesViewModel.changeListFormat(this.listFormat[value]);
  }
}

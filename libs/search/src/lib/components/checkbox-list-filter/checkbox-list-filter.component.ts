import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchFilterComponentInterface } from '../../interfaces';
import { SearchFilterCriteriaInterface } from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent
  implements AfterViewInit, OnDestroy, SearchFilterComponentInterface {
  @Input()
  filterCriteria: SearchFilterCriteriaInterface;
  @Input() maxVisibleItems = 0; // 0 == no limit
  @Output()
  filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  >();

  public toonMeerChildren = false;
  private subscriptions = new Subscription();

  @ViewChild(MatSelectionList) private matList: MatSelectionList;

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.matList.selectionChange
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(event => {
          this.updateCriteria(
            event.source.selectedOptions.selected,
            this.filterCriteria
          );

          this.filterSelectionChange.emit([this.filterCriteria]);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateCriteria(
    selectedOptions: MatListOption[],
    criterium: SearchFilterCriteriaInterface
  ): void {
    if (selectedOptions) {
      const selectedValues = selectedOptions.map(option => option.value);
      criterium.values.forEach(value => {
        value.selected = selectedValues.includes(value);
        if (value.child) {
          this.updateCriteria(selectedOptions, value.child);
        }
      });
    }
  }
}

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { MatSelectionList } from '@angular/material';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SearchFilterComponentInterface } from '../../interfaces';
import { SearchFilterCriteriaInterface } from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent
  implements AfterViewInit, OnDestroy, SearchFilterComponentInterface {
  public showMoreChildren = false;
  public filteredFilterCriteria: SearchFilterCriteriaInterface;

  private subscriptions = new Subscription();
  private _filterCriteria: SearchFilterCriteriaInterface;

  @Input() maxVisibleItems = 0; // 0 == no limit
  @Input()
  get filterCriteria(): SearchFilterCriteriaInterface {
    return this._filterCriteria;
  }
  set filterCriteria(value: SearchFilterCriteriaInterface) {
    if (this._filterCriteria === value) return;

    this._filterCriteria = value;
    this.filteredFilterCriteria = getFilteredCriterium(value);
  }

  @Output()
  filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  >();

  @ViewChild(MatSelectionList) private matList: MatSelectionList;

  ngAfterViewInit(): void {
    this.subscriptions.add(
      this.matList.selectionChange
        .pipe(distinctUntilChanged())
        .subscribe(event => {
          event.option.value.selected = event.option.selected;

          this.filterSelectionChange.emit([this._filterCriteria]);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

export function getFilteredCriterium(
  criterium: SearchFilterCriteriaInterface
): SearchFilterCriteriaInterface {
  return {
    ...criterium,
    ...{
      values: criterium.values
        .filter(value => value.visible && value.prediction)
        // order by selected status
        // needed so selected values aren't hidden
        .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1))
    }
  };
}

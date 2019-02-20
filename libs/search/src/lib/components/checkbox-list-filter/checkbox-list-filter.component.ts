import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { MatCheckbox } from '@angular/material';
import { Subscription } from 'rxjs';
import { SearchFilterComponentInterface } from '../../interfaces';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from './../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-checkbox-list-filter',
  templateUrl: './checkbox-list-filter.component.html',
  styleUrls: ['./checkbox-list-filter.component.scss']
})
export class CheckboxListFilterComponent
  implements OnDestroy, SearchFilterComponentInterface {
  public showMoreChildren = false;
  private subscriptions = new Subscription();

  @Input() maxVisibleItems = 0; // 0 == no limit
  @Input() filterCriteria: SearchFilterCriteriaInterface;

  @Output()
  filterSelectionChange = new EventEmitter<SearchFilterCriteriaInterface[]>();

  public onSelectionChange(event) {
    this.filterSelectionChange.emit([this.filterCriteria]);
  }

  // ngAfterViewInit(): void {
  //   this.subscriptions.add(
  //     this.matList.selectionChanged
  //       .pipe(distinctUntilChanged())
  //       .subscribe(event => {
  //         event.option.value.selected = event.option.selected;

  //         this.filterSelectionChange.emit([this.filterCriteria]);
  //       })
  //   );
  // }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // helper function to convert MatCheckBox value (a string by default)
  // to a SearchFilterCriteriaValuesInterface (which is what is actually set)
  private convertCheckBoxValue(
    checkBox: MatCheckbox
  ): SearchFilterCriteriaValuesInterface {
    return (checkBox.value as unknown) as SearchFilterCriteriaValuesInterface;
  }
}

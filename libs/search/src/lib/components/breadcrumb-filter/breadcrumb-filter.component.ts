import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-breadcrumb-filter',
  templateUrl: './breadcrumb-filter.component.html',
  styleUrls: ['./breadcrumb-filter.component.scss']
})
export class BreadcrumbFilterComponent
  implements SearchFilterComponentInterface {
  criteria: SearchFilterCriteriaInterface[];
  selectedValues: SearchFilterCriteriaValuesInterface[];

  @Input() rootLabel: string;
  @Input()
  set filterCriteria(filterCriteria: SearchFilterCriteriaInterface[]) {
    this.selectedValues = [];
    filterCriteria.forEach(criteria => {
      const selectedValue = criteria.values.find(value => value.selected);
      if (selectedValue) {
        this.selectedValues.push(selectedValue);
      }
    });
    this.criteria = filterCriteria;
  }
  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface[]
  >();

  constructor() {}

  getLabel(value: SearchFilterCriteriaValuesInterface, index: number): string {
    return value.data[this.criteria[index].displayProperty];
  }

  reset() {
    this.clickBreadcrumb(-1);
  }

  clickBreadcrumb(index: number) {
    this.updateSelectedValues(index);
    this.filterSelectionChange.emit([...this.criteria]);
  }

  private updateSelectedValues(startValue: number) {
    for (
      let index = startValue + 1;
      index < this.selectedValues.length;
      index++
    ) {
      this.selectedValues[index].selected = false;
    }
  }
}

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
  public hasPredictions = false;

  selectedValues: SearchFilterCriteriaValuesInterface[];
  private criteria: SearchFilterCriteriaInterface[];

  @Input() rootLabel = 'Alle';
  @Input()
  public set filterCriteria(filterCriteria: SearchFilterCriteriaInterface[]) {
    this.selectedValues = [];
    filterCriteria.forEach(criteria => {
      const selectedValue = criteria.values.find(value => value.selected);
      if (selectedValue) {
        this.selectedValues.push(selectedValue);
      }
    });
    this.criteria = filterCriteria;
  }
  public get filterCriteria() {
    return this.criteria;
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
    this.selectedValues
      .slice(startValue + 1)
      .forEach(value => (value.selected = false));
  }
}

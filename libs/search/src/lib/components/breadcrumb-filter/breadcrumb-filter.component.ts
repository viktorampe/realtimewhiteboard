import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchFilterComponentInterface } from '../../interfaces/search-filter-component-interface';
import { SearchFilterCriteriaInterface } from '../../interfaces/search-filter-criteria.interface';

@Component({
  selector: 'campus-breadcrumb-filter',
  templateUrl: './breadcrumb-filter.component.html',
  styleUrls: ['./breadcrumb-filter.component.scss']
})
export class BreadcrumbFilterComponent
  implements SearchFilterComponentInterface {
  showSeperator: boolean;
  criteria: SearchFilterCriteriaInterface[];
  selectedLabels: string[];

  @Input() rootLabel: string;
  @Input()
  set filterCriteria(filterCriteria: SearchFilterCriteriaInterface[]) {
    this.criteria = filterCriteria;
    this.selectedLabels = filterCriteria.map(this.getLabel);

    this.checkSeparator();
  }
  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface[]
  >();

  constructor() {}

  reset() {
    const filterCriteria = this.criteria[0];
    filterCriteria.values.forEach(criterium => (criterium.selected = false));
    this.filterSelectionChange.emit(this.criteria.slice(0, 1));
  }

  clickBreadcrumb(index: number) {
    this.filterSelectionChange.emit(this.criteria.slice(0, index + 1));
  }

  private checkSeparator() {
    this.showSeperator = this.criteria[0].values.some(value => value.selected);
  }

  private getLabel(filterCriterium: SearchFilterCriteriaInterface): string {
    const selectedCriterium = filterCriterium.values.find(
      criterium => criterium.selected
    );
    if (selectedCriterium)
      return selectedCriterium.data[filterCriterium.displayProperty];
  }
}

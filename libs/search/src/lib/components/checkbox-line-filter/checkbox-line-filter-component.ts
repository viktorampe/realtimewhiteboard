import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  SearchFilterComponentInterface,
  SearchFilterCriteriaInterface
} from '../../interfaces';

@Component({
  selector: 'campus-checkbox-line-filter',
  templateUrl: './checkbox-line-filter-component.html',
  styleUrls: ['./checkbox-line-filter-component.scss']
})
export class CheckboxLineFilterComponent
  implements OnInit, SearchFilterComponentInterface {
  public filteredFilterCriteria: SearchFilterCriteriaInterface;
  private _filterCriteria: SearchFilterCriteriaInterface;

  @Output() filterSelectionChange = new EventEmitter<
    SearchFilterCriteriaInterface | SearchFilterCriteriaInterface[]
  >();

  @Input()
  get filterCriteria(): SearchFilterCriteriaInterface {
    return this._filterCriteria;
  }
  set filterCriteria(value: SearchFilterCriteriaInterface) {
    if (this._filterCriteria === value) return;

    this._filterCriteria = value;
    this.filteredFilterCriteria = getFilteredCriterium(value);
  }

  @HostBinding('class.checkbox-line-filter-component')
  get isCheckboxLineFilterClass() {
    return true;
  }

  constructor() {}

  ngOnInit() {}

  //todo change any with actual interface
  itemChanged(value: any) {
    value.selected = !value.selected;
    this.filterSelectionChange.emit(this.filterCriteria);
  }
}

export function getFilteredCriterium(
  criterium: SearchFilterCriteriaInterface
): SearchFilterCriteriaInterface {
  return {
    ...criterium,
    ...{
      values: criterium.values.filter(value => value.visible)
    }
  };
}

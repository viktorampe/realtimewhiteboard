import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Dictionary } from '@ngrx/entity';
import { KeyWithPropertyType } from '../../interfaces/keyWithPropertyType.type';

// TODO import real interface
interface SearchFilterCriteriaInterface<T, K> {
  name: string;
  label: string;
  keyProperty: KeyWithPropertyType<T, string>;
  displayProperty: KeyWithPropertyType<T, string>;
  values: {
    data: T;
    selected?: boolean;
    prediction?: number;
    visible?: boolean;
    children?: SearchFilterCriteriaInterface<K, unknown>;
  }[];
}

@Component({
  selector: 'campus-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent<T, K> implements OnInit {
  criteria: SearchFilterCriteriaInterface<T, K>;
  options: SelectOption[];
  selected: SelectOption | SelectOption[];
  selectControl: FormControl = new FormControl(this.selected);

  private optionsMap: Dictionary<T>;

  @Input() multiple = false;
  @Input()
  set filterCriteria(criteria: SearchFilterCriteriaInterface<T, K>) {
    this.criteria = criteria;
    this.parseCriteria();
  }

  @Output() selection: EventEmitter<
    SearchFilterCriteriaInterface<T, K> | SearchFilterCriteriaInterface<T, K>[]
  >;

  constructor() {}

  ngOnInit() {}

  private parseCriteria() {
    this.options = this.valuesToOptions(this.criteria.values);
    this.optionsMap = this.createValuesMap(this.criteria.values);
  }

  private valuesToOptions(values): SelectOption[] {
    return values.map(
      value =>
        ({
          value: value.data[this.criteria.keyProperty],
          viewValue: value.data[this.criteria.displayProperty]
        } as SelectOption)
    );
  }

  private optionsToValues(options): SearchFilterCriteriaInterface<T, K> {
    return options.map(option => this.optionsMap[option.value]);
  }

  private createValuesMap(values): Dictionary<T> {
    return values.reduce((acc, value) => {
      const id = value.data[this.criteria.keyProperty] as unknown;
      acc[id as number] = value;
      return acc;
    }, {});
  }
}

export interface SelectOption {
  value: any;
  viewValue: string;
}

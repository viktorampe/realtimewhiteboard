import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-checkbox-selection-list-filter',
  templateUrl: './checkbox-selection-list-filter.component.html',
  styleUrls: ['./checkbox-selection-list-filter.component.scss']
})
export class CheckboxSelectionListFilterComponent {
  @Input() criterium: any;

  constructor() {}

  public getValueObject(criterium: any) {
    return {
      [this.criterium.keyProperty]: criterium.data[this.criterium.keyProperty],
      criterium
    };
  }

  public getDisplayValue(criterium: any) {
    return criterium.data[this.criterium.displayProperty];
  }
}

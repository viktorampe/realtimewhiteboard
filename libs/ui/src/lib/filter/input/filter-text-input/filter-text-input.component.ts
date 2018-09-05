import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { FilterTextInputComponentInterface } from './filter-text-input.component.interface';

@Component({
  selector: 'campus-filter-text-input',
  templateUrl: './filter-text-input.component.html',
  styleUrls: ['./filter-text-input.component.scss']
})
export class FilterTextInputComponent
  implements OnInit, FilterTextInputComponentInterface {
  $input = new FormControl();
  placeholder: string;
  filter: boolean = false;

  constructor() {
    this.$input.valueChanges.subscribe(observer => {
      console.log(observer);
    });
  }

  ngOnInit() {}

  setvalue(value: string) {
    this.$input.setValue(value);
  }

  clear() {
    this.$input.reset();
  }

  onChange(): Observable<string> {
    return this.$input.valueChanges;
  }

  setPlaceHolder(placeholder: string = 'Filter') {
    this.placeholder = placeholder;
  }
}

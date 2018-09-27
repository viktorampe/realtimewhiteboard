import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterTextInputComponentInterface } from './filter-text-input.component.interface';

@Component({
  selector: 'campus-filter-text-input',
  templateUrl: './filter-text-input.component.html',
  styleUrls: ['./filter-text-input.component.scss']
})
export class FilterTextInputComponent
  implements FilterTextInputComponentInterface {
  input$ = new FormControl();
  placeholder: string = 'Filter';

  setvalue(value: string) {
    this.input$.setValue(value);
  }

  clear() {
    this.input$.setValue('');
  }

  changeInput(): Observable<string> {
    return this.input$.valueChanges.pipe(
      map((st: string) => {
        console.log('value changed', st);
        if (!st) {
          return '';
        }
        return st;
      })
    );
  }

  setPlaceHolder(placeholder: string = 'Filter') {
    this.placeholder = placeholder;
  }
}

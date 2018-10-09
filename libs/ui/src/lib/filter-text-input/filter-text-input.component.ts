import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export enum FilterTextInputTheme {
  light = 'light',
  dark = 'dark'
}

/**
 * an input field that will output text put into it, will show a clear button when text lenght > 0
 * meant to filter by string.
 *
 * @export
 * @class FilterTextInputComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'campus-filter-text-input',
  templateUrl: './filter-text-input.component.html',
  styleUrls: ['./filter-text-input.component.scss']
})
export class FilterTextInputComponent implements OnDestroy {
  @Input() theme: FilterTextInputTheme;
  @Input() placeholder = 'Filter';
  @Input()
  set filterText(filterText: string) {
    this.input.setValue(filterText);
  }
  @Output() text = new EventEmitter<string>();

  input = new FormControl(this.filterText);

  private readonly formSubscription: Subscription = this.input.valueChanges.subscribe(
    (data: string) => {
      this.text.emit(data);
    }
  );

  /**
   * clears the input value of the textfield
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  clear(): void {
    this.input.setValue('');
  }

  /**
   * enter button is pressed, make sure it returns false to prevent default behavior
   *
   * @returns {boolean}
   * @memberof FilterTextInputViewModel
   */
  inputEnter(e: KeyboardEvent): boolean {
    e.preventDefault();
    return false;
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}

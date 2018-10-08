import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

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

  private input = new FormControl(this.filterText);
  private readonly formSubscription: Subscription = this.getInput().subscribe(
    (data: string) => {
      this.text.emit(data);
    }
  );

  /**
   * sets the input value of the textfield
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  setInput(value: string): void {
    this.input.setValue(value);
  }

  /**
   * clears the input value of the textfield
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  clear(): void {
    this.setInput('');
  }

  /**
   * enter button is pressed, make sure it returns false to prevent default behavior
   *
   * @returns {boolean}
   * @memberof FilterTextInputViewModel
   */
  inputEnter(): boolean {
    return false;
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  /**
   * gets the input of the textfield as an observable
   *
   * @returns {Observable<string>}
   * @memberof FilterTextInputComponent
   */
  private getInput(): Observable<string> {
    return this.input.valueChanges;
  }
}

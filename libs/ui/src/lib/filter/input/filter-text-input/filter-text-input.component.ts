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
  @Input('theme') theme: FilterTextInputTheme;
  @Input('placeholder') placeholder = 'Filter';
  @Output() text = new EventEmitter<string>();

  input = new FormControl();

  //for some bizar reason async pipes refused to work in our html file, making this weirdness necessary
  hasData = false;
  private readonly formSubscription: Subscription = this.getInput().subscribe(
    (data: string) => {
      this.text.emit(data);
      if (data !== null && data.length > 0) {
        this.hasData = true;
      } else {
        this.hasData = false;
      }
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
   * gets the input of the textfield as an observable
   *
   * @returns {Observable<string>}
   * @memberof FilterTextInputComponent
   */
  private getInput(): Observable<string> {
    return this.input.valueChanges;
  }

  /**
   * enter button is pressed, make sure it returns false to prevent default behavior
   *
   * @returns {boolean}
   * @memberof FilterTextInputViewModel
   */
  enterPressed(): boolean {
    return false;
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}

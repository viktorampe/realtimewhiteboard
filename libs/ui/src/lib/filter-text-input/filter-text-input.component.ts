import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
export class FilterTextInputComponent<I, O> {
  public filterFn: (source: I, filterText: string | number) => O[];
  public result$: Observable<O[]>;
  private input = new FormControl('');

  @Input() theme: FilterTextInputTheme;
  @Input() placeholder = 'Filter';
  @Input()
  set source(source: I) {
    this.result$ = this.input.valueChanges.pipe(
      startWith(''),
      map(filterText => this.filterFn(source, filterText))
    );
  }

  /**
   * clears the input value of the textfield
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  clear(): void {
    this.input.setValue('');
  }

  setValue(filterInput: string): void {
    this.input.setValue(filterInput);
  }

  /**
   * enter button is pressed, make sure it returns false to prevent default behavior
   *
   * @returns {boolean}
   * @memberof FilterTextInputViewModel
   */
  onEnterPressed(e: KeyboardEvent): boolean {
    e.preventDefault();
    return false;
  }
}

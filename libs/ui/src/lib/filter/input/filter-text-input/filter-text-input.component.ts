import { Component, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterTextInputViewModel } from './filter-text-input.viewmodel';

export enum FilterTextInputTheme {
  light = 'light',
  dark = 'dark'
}

@Component({
  selector: 'campus-filter-text-input',
  templateUrl: './filter-text-input.component.html',
  styleUrls: ['./filter-text-input.component.scss']
})
export class FilterTextInputComponent implements OnDestroy {
  constructor(private viewModel: FilterTextInputViewModel) {}

  @Input('theme') theme: FilterTextInputTheme;

  /**
   * sets the input value of the textfield
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  setInput(value: string): void {
    this.viewModel.setInput(value);
  }

  /**
   * clears the input value of the textfield
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  clear(): void {
    return this.viewModel.clear();
  }

  /**
   * returns whether or not the clear button is visible
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  isClearButtonVisible(): boolean {
    return this.viewModel.isClearButtonVisible();
  }

  /**
   * gets the input of the textfield as an observable
   *
   * @returns {Observable<string>}
   * @memberof FilterTextInputComponent
   */
  getInput(): Observable<string> {
    return this.viewModel.getInput();
  }

  /**
   * sets the placeholder text
   *
   * @param {string} placeholder
   * @memberof FilterTextInputComponent
   */
  setPlaceHolder(placeholder: string): void {
    this.viewModel.setPlaceHolder(placeholder);
  }

  /**
   * gets the placeholder text
   *
   * @returns {string}
   * @memberof FilterTextInputComponent
   */
  getPlaceHolder(): string {
    return this.viewModel.getPlaceHolder();
  }

  /**
   * set the theme that is to be used for this component
   *
   * @param {FilterTextInputTheme} theme
   * @memberof FilterTextInputComponent
   */
  setTheme(theme: FilterTextInputTheme) {
    this.theme = theme;
    //todo implement theming
  }

  ngOnDestroy() {
    this.viewModel.destroy();
  }
}

import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterTextInputViewModel {
  public input$ = new FormControl();
  private placeholder: string = 'Filter';

  //for some bizar reason async pipes refused to work in our html file, making this weirdness necessary
  private hasData: boolean = false;
  private readonly formSubscription: Subscription = this.getInput().subscribe(
    (data: string) => {
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
    this.input$.setValue(value);
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
   * returns whether or not the clear button is visible
   *
   * @param {string} value
   * @memberof FilterTextInputComponent
   */
  isClearButtonVisible(): Observable<boolean> {
    return this.getInput().pipe(
      map((str: string) => {
        console.log(str, str.length > 0);
        return str.length > 0;
      }),
      catchError(err => {
        console.log(false);
        return of(false);
      })
    );
  }

  /**
   * gets the input of the textfield as an observable
   *
   * @returns {Observable<string>}
   * @memberof FilterTextInputComponent
   */
  getInput(): Observable<string> {
    return this.input$.valueChanges;
  }

  /**
   * sets the placeholder text
   *
   * @param {string} placeholder
   * @memberof FilterTextInputComponent
   */
  setPlaceHolder(placeholder: string): void {
    this.placeholder = placeholder;
  }

  /**
   * gets the placeholder text
   *
   * @returns {string}
   * @memberof FilterTextInputViewModel
   */
  getPlaceHolder(): string {
    return this.placeholder;
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

  destroy(): void {
    this.formSubscription.unsubscribe();
  }
}

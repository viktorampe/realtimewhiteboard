import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
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
export class FilterTextInputComponent implements OnDestroy {
  private input = new FormControl('');
  private subscriptions = new Subscription();

  @Input()
  set source(source: any[]) {
    this.subscriptions.add(this.filterSource(source));
  }
  @Input() filterKey: string;
  @Input() filterIgnoreCase?: boolean = true;
  @Input() theme: FilterTextInputTheme;
  @Input() placeholder = 'Filter';
  @Output() filtered = new EventEmitter<any[]>();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  private filterSource(source: any[]): Subscription {
    return this.input.valueChanges
      .pipe(
        startWith(''),
        map(filterText =>
          this.filter(source, this.filterKey, filterText, this.filterIgnoreCase)
        )
      )
      .subscribe(filtered => {
        this.filtered.emit(filtered);
      });
  }

  /**
   * Filter an array where key matches value partially
   *
   * @param {T[]} list array of object to filter
   * @param {string} key (path to) object key with value to compare
   * @param {string} filterText text to filter on
   * @param {boolean} ignoreCase if filter is case sensitive
   * @returns {T[]}
   */
  private filter<T>(
    list: T[],
    key: string,
    filterText: string,
    ignoreCase: boolean
  ): T[] {
    if (!filterText) {
      return list;
    }
    if (ignoreCase) {
      filterText = filterText.toLowerCase();
    }
    const keys: string[] = key.split('.');
    return list.filter(item => {
      // traverse object until we reach the specified key
      let prop: string = keys.reduce((p: T, k: string) => {
        return p[k] || '';
      }, item);
      if (ignoreCase) {
        prop = prop.toLowerCase();
      }
      return prop.includes(filterText);
    });
  }
}

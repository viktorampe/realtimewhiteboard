import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FilterTextInputComponentInterface } from './filter-text-input.component.interface';

@Component({
  selector: 'campus-filter-text-input',
  templateUrl: './filter-text-input.component.html',
  styleUrls: ['./filter-text-input.component.scss']
})
export class FilterTextInputComponent
  implements FilterTextInputComponentInterface, OnDestroy {
  public input$ = new FormControl();
  public placeholder: string = 'Filter';

  @HostBinding('class') componentCssClass;
  constructor(public overlayContainer: OverlayContainer) {}

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

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  setInput(value: string): void {
    this.input$.setValue(value);
  }
  clear(): void {
    this.setInput('');
  }

  isClearButtonVisible(): boolean {
    return this.hasData;
  }

  getInput(): Observable<string> {
    return this.input$.valueChanges;
  }

  setPlaceHolder(placeholder: string): void {
    this.placeholder = placeholder;
  }
}

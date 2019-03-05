import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss']
})
export class SearchTermComponent implements OnInit {
  private _value: string;

  @Input() public initialValue = '';
  @Input() public placeholder = 'Zoeken';

  // boolean => internal reference, need array of values
  // string => external reference TODO: figure this out, when required
  @Input() public autoComplete: string | boolean;
  @Input() public autoCompleteValues: string[] = [];

  // emits on every change -> parent component should debounce
  // change event exists by default -> emits on blur
  // input event exists by default -> emits single characters
  @Output() public valueChange = new EventEmitter<string>();

  public get currentValue(): string {
    return this._value;
  }
  public set currentValue(value) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  onChange(event) {
    this.valueChange.emit(this.currentValue || '');
  }

  ngOnInit() {
    this._value = this.initialValue;
  }
}

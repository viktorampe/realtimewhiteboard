import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-search-term',
  templateUrl: './search-term.component.html',
  styleUrls: ['./search-term.component.scss']
})
export class SearchTermComponent implements OnInit {
  public currentValue: string;

  @Input() public initialValue = '';
  @Input() public placeholder = 'Zoeken';
  @Input() public autofocus = false;

  // boolean => internal reference, need array of values
  // string => external reference TODO: figure this out, when required
  @Input() public autoComplete: string | boolean = true;
  @Input() public autoCompleteValues: string[] = [];
  @Input() public emitOnTextChange = false;

  @Output() public valueChange = new EventEmitter<string>();
  @Output() public valueChangeForAutoComplete = new EventEmitter<string>();

  ngOnInit() {
    this.currentValue = this.initialValue;
  }

  onChange() {
    this.valueChange.emit(this.currentValue || '');
  }

  getAutoCompleteValues() {
    if (this.currentValue.length < 2 || !this.autoComplete) return;

    this.valueChangeForAutoComplete.emit(this.currentValue);
  }
  onTextChange() {
    if (this.emitOnTextChange) {
      this.onChange();
    }
  }

  getAutoFocusValue() {
    return this.autofocus ? 'autofocus' : null;
  }
}

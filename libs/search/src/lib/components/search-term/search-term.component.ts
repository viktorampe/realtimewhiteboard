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

  // boolean => internal reference, need array of values
  // string => external reference TODO: figure this out, when required
  @Input() public autoComplete: string | boolean = true;
  @Input() public autoCompleteValues: string[] = [];

  @Output() public valueChange = new EventEmitter<string>();

  onChange(event) {
    this.valueChange.emit(this.currentValue || '');
  }

  ngOnInit() {
    this.currentValue = this.initialValue;
  }
}

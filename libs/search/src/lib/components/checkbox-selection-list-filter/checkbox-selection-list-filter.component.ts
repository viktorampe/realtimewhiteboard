import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'campus-checkbox-selection-list-filter',
  templateUrl: './checkbox-selection-list-filter.component.html',
  styleUrls: ['./checkbox-selection-list-filter.component.scss']
})
export class CheckboxSelectionListFilterComponent implements OnInit {
  @Input() value: string;
  constructor() {}

  ngOnInit() {}
}

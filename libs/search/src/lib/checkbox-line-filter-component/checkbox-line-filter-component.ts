import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-checkbox-line-filter',
  templateUrl: './checkbox-line-filter-component.html',
  styleUrls: ['./checkbox-line-filter-component.scss']
})
export class CheckboxLineFilterComponent implements OnInit {
  items = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  constructor() {}

  ngOnInit() {}
}

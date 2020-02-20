import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent implements OnInit {
  @Output() selectedColor = new EventEmitter<string>();
  defaultColors: string[] = [
    '#00A7E2',
    '#2EA03D',
    '#E22940',
    '#5D3284',
    '#FADB48'
  ];
  constructor() {}

  ngOnInit() {}

  clickColor(color: string) {
    this.selectedColor.emit(color);
  }
}

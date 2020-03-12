import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent implements OnInit {
  @Output() selectedColor = new EventEmitter<string>();
  defaultColors: { colorName: string; hexCode: string }[] = [
    { colorName: 'blue', hexCode: '#00A7E2' },
    { colorName: 'green', hexCode: '#2EA03D' },
    { colorName: 'red', hexCode: '#E22940' },
    { colorName: 'purple', hexCode: '#5D3284' },
    { colorName: 'yellow', hexCode: '#FADB48' }
  ];
  constructor() {}

  ngOnInit() {}

  clickColor(color: string) {
    this.selectedColor.emit(color);
  }
}

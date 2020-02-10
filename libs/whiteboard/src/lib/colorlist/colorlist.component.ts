import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-colorlist',
  templateUrl: './colorlist.component.html',
  styleUrls: ['./colorlist.component.scss']
})
export class ColorlistComponent implements OnInit {
  @Output() selectedColor = new EventEmitter<string>();
  colorlist: ColorlistComponent;
  defaultColors: string[] = [
    '#ffff80',
    '#ff80ff',
    '#80ffff',
    '#80ff80',
    '#ff8080',
    '#8080ff'
  ];
  constructor() {}

  ngOnInit() {}

  clickColor(color: string) {
    this.selectedColor.emit(color);
  }
}

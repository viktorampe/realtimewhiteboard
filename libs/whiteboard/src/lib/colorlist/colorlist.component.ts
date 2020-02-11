import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-colorlist',
  templateUrl: './colorlist.component.html',
  styleUrls: ['./colorlist.component.scss']
})
export class ColorlistComponent implements OnInit {
  @Input() isWhiteboardColorlist: boolean;
  @Output() selectedColor = new EventEmitter<string>();
  colorlist: ColorlistComponent;
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

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
  animations: [
    trigger('showHideColorSwatchOne', [
      transition(':enter', [
        style({ transform: 'scale(0) translateX(0px)' }),
        animate(
          '150ms ease-in-out',
          style({
            transform: 'scale(1) translateX(-48px)'
          })
        )
      ]),
      transition(':leave', [
        style({
          transform: 'scale(1) translateX(-48px)'
        }),
        animate(
          '150ms ease-in-out',
          style({ transform: 'scale(0) translateX(0px)' })
        )
      ])
    ])
  ]
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

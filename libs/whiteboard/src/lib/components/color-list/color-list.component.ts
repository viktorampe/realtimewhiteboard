import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
  animations: [
    trigger('showHideColorSwatchOne', [
      transition(':enter', [
        style({ transform: 'scale(0) translateX(48px)' }),
        animate(
          '150ms 500ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ transform: 'translateX(48px) scale(0)', offset: 0 }),
            style({ transform: 'translateX(10px)', offset: 0.65 }),
            style({ transform: 'translateX(-6px)', offset: 0.8 }),
            style({ transform: 'translateX(4px)', offset: 0.85 }),
            style({ transform: 'translateX(-2px)', offset: 0.9 }),
            style({ transform: 'translateX(0) scale(1)', offset: 1 })
          ])
        )
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0) scale(1)'
        }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'translateX(48px) scale(0)' })
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

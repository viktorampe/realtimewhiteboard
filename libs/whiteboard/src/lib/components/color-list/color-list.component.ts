import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';
import { ColorInterface } from '../../models/color.interface';

const defaultColorOptions: ColorInterface[] = [
  { label: 'blue', hexCode: '#00A7E2' },
  { label: 'green', hexCode: '#2EA03D' },
  { label: 'red', hexCode: '#E22940' },
  { label: 'purple', hexCode: '#5D3284' },
  { label: 'yellow', hexCode: '#FADB48' }
];

@Component({
  selector: 'campus-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
  animations: [
    trigger('showHideColorSwatchOne', [
      transition('void => edit', [
        style({ transform: 'scale(0) translateX(48px)' }),
        animate(
          '150ms 350ms cubic-bezier(.43,0,.31,1)',
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
      transition('void => select', [
        style({ transform: 'scale(0) translateX(48px)' }),
        animate(
          '150ms 400ms cubic-bezier(.43,0,.31,1)',
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
      transition('whiteboard => void', []),
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
export class ColorListComponent {
  @Input() zoomFactor: number;
  @Input() activeColor: string;
  @Input() mode: ModeEnum;
  @Input() colorOptions: ColorInterface[] = defaultColorOptions;

  @Output() selectedColor = new EventEmitter<string>();

  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  clickColor(color: string) {
    this.selectedColor.emit(color);
  }
}

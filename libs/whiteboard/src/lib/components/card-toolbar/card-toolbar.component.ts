import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardTypeEnum } from '../../enums/cardType.enum';
import { ModeEnum } from '../../enums/mode.enum';
import { ColorPickerModeEnum } from '../color-picker/color-picker.component';

@Component({
  selector: 'campus-card-toolbar',
  templateUrl: './card-toolbar.component.html',
  styleUrls: ['./card-toolbar.component.scss'],
  animations: [
    trigger('showHideToolbarTool', [
      transition(':enter', [
        style({ transform: 'scale(0) translateY(0px)' }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ transform: 'translateY(48px) scale(0)', offset: 0 }),
            style({ transform: 'translateY(10px)', offset: 0.65 }),
            style({ transform: 'translateY(-6px)', offset: 0.8 }),
            style({ transform: 'translateY(4px)', offset: 0.85 }),
            style({ transform: 'translateY(-2px)', offset: 0.9 }),
            style({ transform: 'translateY(0) scale(1)', offset: 1 })
          ])
        )
      ]),
      transition('multiSelect => void', [
        style({
          transform: 'translateY(0) scale(1)'
        }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'translateY(48px) scale(0)' })
        )
      ]),
      transition(':leave', [
        style({
          transform: 'translateY(0) scale(1)'
        }),
        animate(
          '150ms 450ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'translateY(48px) scale(0)' })
        )
      ])
    ])
  ]
})
export class CardToolbarComponent implements OnInit {
  public colorPickerModes: typeof ColorPickerModeEnum = ColorPickerModeEnum;

  @Input() mode: ModeEnum;
  @Input() zoomFactor: number;
  @Input() inShelf: boolean;
  @Input() canManage: boolean;
  @Input() cardType: CardTypeEnum;
  @Input() activeColor: string;

  @Output() clickDeleteIcon = new EventEmitter<void>();
  @Output() clickReturnToShelfIcon = new EventEmitter<void>();
  @Output() clickEditIcon = new EventEmitter<void>();
  @Output() clickConfirmIcon = new EventEmitter<void>();
  @Output() clickFlipIcon = new EventEmitter<void>();
  @Output() clickMultiSelectIcon = new EventEmitter<void>();
  @Output() clickMultiSelectSelectedIcon = new EventEmitter<void>();
  @Output() selectedColor = new EventEmitter<string>();

  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  get CardType() {
    return CardTypeEnum;
  }

  ngOnInit() {}

  deleteIconClicked() {
    this.clickDeleteIcon.emit();
  }

  returnToShelfIconClicked() {
    this.clickReturnToShelfIcon.emit();
  }

  editIconClicked() {
    this.clickEditIcon.emit();
  }

  confirmIconClicked() {
    this.clickConfirmIcon.emit();
  }

  flipIconClicked() {
    this.clickFlipIcon.emit();
  }

  multiSelectClicked() {
    this.clickMultiSelectIcon.emit();
  }

  multiSelectSelectedClicked() {
    this.clickMultiSelectSelectedIcon.emit();
  }

  colorSelected(color) {
    this.selectedColor.emit(color);
  }
}

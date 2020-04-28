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
        style({ transform: 'scale(0)' }),
        animate(
          '200ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ transform: 'scale(0)', offset: 0 }),
            style({ transform: 'scale(1.1)', offset: 0.75 }),
            style({ transform: 'scale(0.95)', offset: 0.9 }),
            style({ transform: 'scale(1.02)', offset: 0.95 }),
            style({ transform: 'scale(1)', offset: 1 })
          ])
        )
      ]),
      transition('multiSelect => void', [
        style({
          transform: 'scale(1)'
        }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'scale(0)' })
        )
      ]),
      transition(':leave', [
        style({
          transform: 'scale(1)'
        }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'scale(0)' })
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorPickerModeEnum } from '../color-picker/color-picker.component';

@Component({
  selector: 'campus-whiteboard-toolbar',
  templateUrl: './whiteboard-toolbar.component.html',
  styleUrls: ['./whiteboard-toolbar.component.scss']
})
export class WhiteboardToolbarComponent implements OnInit {
  @Input() canManage: boolean;
  @Output() deleteCards = new EventEmitter();
  @Output() returnCardsToShelf = new EventEmitter();
  @Output() changeSelectedColor = new EventEmitter<string>();
  public colorPickerModes: typeof ColorPickerModeEnum = ColorPickerModeEnum;
  public activeColor: string;

  constructor() {}

  ngOnInit() {}

  changeSelectedCardsColor(color: string) {
    this.activeColor = color;
    this.changeSelectedColor.emit(color);
  }

  btnDeleteClicked() {
    this.deleteCards.emit();
  }

  btnReturnToShelfClicked() {
    this.returnCardsToShelf.emit();
  }
}

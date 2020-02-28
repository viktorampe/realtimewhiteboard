import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent {
  @Input() imageUrl: string;
  @Input() mode: ModeEnum;
  @Output() remove = new EventEmitter<void>();
  @Output() openFilePicker = new EventEmitter<void>();

  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  removeImage() {
    this.remove.emit();
  }

  chooseImage() {
    this.openFilePicker.emit();
  }
}

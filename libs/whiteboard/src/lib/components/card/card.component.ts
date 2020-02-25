import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() mode: ModeEnum;
  @Input() color: string;
  @Input() description: string;
  @Input() image: string;
  @Input() viewModeImage: boolean;

  @Output() removeImage = new EventEmitter<void>();
  @Output() updateImage = new EventEmitter<string>();

  @Output() modeChange = new EventEmitter<ModeEnum>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() imageChange = new EventEmitter<string>();
  @Output() viewModeImageChange = new EventEmitter<boolean>();

  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  emitRemoveImage() {
    this.removeImage.emit();
  }

  emitUpdateImage(url: string) {
    this.updateImage.emit(url);
  }

  selectColor(color: string) {
    this.colorChange.emit(color);
  }

  onDescriptionChange(description: string) {
    this.descriptionChange.emit(description);
  }
}

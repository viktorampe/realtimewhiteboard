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

  @Output() cardTapped = new EventEmitter<void>();
  @Output() cardPressed = new EventEmitter<void>();
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

  onClickCard(event: MouseEvent) {
    if (this.mode !== ModeEnum.IDLE) {
      event.stopPropagation();
    }
  }

  onPressCard() {
    this.cardPressed.emit();
  }

  onTapCard() {
    this.cardTapped.emit();
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mode } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() mode: Mode;
  @Input() color: string;
  @Input() description: string;
  @Input() image: string;
  @Input() viewModeImage: boolean;

  @Output() cardTapped = new EventEmitter<void>();
  @Output() cardPressed = new EventEmitter<void>();
  @Output() removeImage = new EventEmitter<void>();
  @Output() updateImage = new EventEmitter<string>();

  @Output() modeChange = new EventEmitter<Mode>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() imageChange = new EventEmitter<string>();
  @Output() viewModeImageChange = new EventEmitter<boolean>();

  constructor() {}

  get Mode() {
    return Mode;
  }

  onClickCard(event: MouseEvent) {
    if (this.mode !== Mode.IdleMode) {
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';

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

  @Output() deleteCard = new EventEmitter();
  @Output() select = new EventEmitter<void>();
  @Output() deselect = new EventEmitter<void>();
  @Output() cardTapped = new EventEmitter<void>();
  @Output() cardPressed = new EventEmitter<void>();
  @Output() removeImage = new EventEmitter<void>();
  @Output() updateImage = new EventEmitter<string>();
  @Output() editIconClicked = new EventEmitter<void>();
  @Output() confirmIconClicked = new EventEmitter<void>();
  @Output() flipIconClicked = new EventEmitter<void>();

  @Output() modeChange = new EventEmitter<Mode>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() imageChange = new EventEmitter<string>();
  @Output() viewModeImageChange = new EventEmitter<boolean>();

  constructor() {}

  get Mode() {
    return Mode;
  }

  pressCard() {
    this.cardPressed.emit();
  }

  onClickCard(event: MouseEvent) {
    if (this.mode !== Mode.IdleMode) {
      event.stopPropagation();
    }
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

  setIdleMode() {
    this.mode = Mode.IdleMode;
    this.modeChange.emit(this.mode);
  }

  setMultiSelectSelectedMode() {
    this.select.emit();
  }

  setMultiSelectMode() {
    this.deselect.emit();
  }

  emitDeleteCard() {
    this.deleteCard.emit();
  }

  emitEditIcon() {
    this.editIconClicked.emit();
  }

  emitConfirmIcon() {
    this.confirmIconClicked.emit();
  }

  emitFlipIcon() {
    this.flipIconClicked.emit();
  }

  emitSelectColor(color: string) {
    this.colorChange.emit(color);
  }

  onDescriptionChange(description: string) {
    this.descriptionChange.emit(description);
  }

  toggleViewModeImage() {
    this.viewModeImage = !this.viewModeImage;
  }
}

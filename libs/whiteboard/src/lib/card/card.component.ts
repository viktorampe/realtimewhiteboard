import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() mode: Mode;
  @Input() color: string;
  @Input() description: string;
  @Input() image: string;

  @Output() deleteCard = new EventEmitter();
  @Output() lastColor = new EventEmitter<string>();
  @Output() select = new EventEmitter<void>();
  @Output() deselect = new EventEmitter<void>();

  @Output() modeChange = new EventEmitter<Mode>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() descriptionChange = new EventEmitter<string>();
  @Output() imageChange = new EventEmitter<string>();

  viewModeImage: boolean;

  constructor() {
    this.viewModeImage = true;
  }

  ngOnInit() {}

  get Mode() {
    return Mode;
  }

  pressCard() {
    if (this.mode === Mode.SelectedMode || this.mode === Mode.EditMode) {
      this.setIdleMode();
    } else {
      this.setSelectedMode();
    }
  }

  removeImage() {
    this.image = '';
    this.imageChange.emit(this.image);
  }

  updateImage(url: string) {
    this.image = url;

    this.imageChange.emit(this.image);

    this.setUploadMode();

    // TODO: remove this settimeout and wait for actual image upload
    setTimeout(() => {
      this.setIdleMode();
    }, 500);
  }

  setEditMode() {
    this.mode = Mode.EditMode;
    this.modeChange.emit(this.mode);
  }

  setSelectedMode() {
    this.mode = Mode.SelectedMode;
    this.modeChange.emit(this.mode);
  }

  setIdleMode() {
    this.mode = Mode.IdleMode;
    this.modeChange.emit(this.mode);
  }

  setUploadMode() {
    this.mode = Mode.UploadMode;
    this.modeChange.emit(this.mode);
  }

  setMultiSelectSelectedMode() {
    this.mode = Mode.MultiSelectSelectedMode;
    this.select.emit();
  }

  emitDeleteCard() {
    this.deleteCard.emit();
  }

  selectColor(color: string) {
    this.color = color;
    this.colorChange.emit(this.color);

    this.lastColor.emit(color);
    this.setIdleMode();
  }

  onDescriptionChange(description: string) {
    this.descriptionChange.emit(description);
  }

  flipIconClicked() {
    this.toggleViewModeImage();

    if (this.mode !== Mode.EditMode) {
      this.setIdleMode();
    }
  }

  toggleViewModeImage() {
    this.viewModeImage = !this.viewModeImage;
  }
}

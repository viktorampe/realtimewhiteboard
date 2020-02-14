import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() mode: Mode;
  @Input() color: string;
  @Input() description: string;
  @Input() image: string;
  @Input() top: number;
  @Input() left: number;

  @Output() deleteCard = new EventEmitter();
  @Output() lastColor = new EventEmitter<string>();
  @Output() select = new EventEmitter<void>();
  @Output() deselect = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<Mode>();

  @HostBinding('style.top') topStyle: string;
  @HostBinding('style.left') leftStyle: string;
  viewModeImage: boolean;

  constructor() {
    this.viewModeImage = true;
  }

  ngOnInit() {}

  ngOnChanges() {
    this.topStyle = this.top + 'px';
    this.leftStyle = this.left + 'px';
  }

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
  }

  replaceImage(url: string) {
    this.image = url;
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

  setMultiSelectSelectedMode() {
    this.mode = Mode.MultiSelectSelectedMode;
    this.select.emit();
  }

  emitDeleteCard() {
    this.deleteCard.emit();
  }

  selectColor(color: string) {
    this.color = color;
    this.lastColor.emit(color);
    this.setIdleMode();
  }

  toggleViewModeImage() {
    this.viewModeImage = !this.viewModeImage;
    this.setIdleMode();
  }
}

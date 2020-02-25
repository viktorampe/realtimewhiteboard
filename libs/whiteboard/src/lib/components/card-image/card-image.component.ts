import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() mode: ModeEnum;
  @Output() removeClicked = new EventEmitter<void>();
  @Output() openFilePicker = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  get Mode() {
    return ModeEnum;
  }

  emitRemoveClicked() {
    this.removeClicked.emit();
  }

  emitOpenFilePicker() {
    this.openFilePicker.emit();
  }
}

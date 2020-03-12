import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';
import CardInterface from '../../models/card.interface';
import ImageInterface from '../../models/image.interface';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() mode: ModeEnum;
  @Input() color: string;
  @Input() description: string;
  @Input() image: ImageInterface;
  @Input() viewModeImage: boolean;

  @Output() openFilePicker = new EventEmitter<string>();
  @Output() update = new EventEmitter<Partial<CardInterface>>();
  @Output() remove = new EventEmitter<void>();
  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  removeImage() {
    this.remove.emit();
  }

  selectImage() {
    this.openFilePicker.emit();
  }

  selectColor(color: string) {
    this.update.emit({
      color: color
    });
  }

  updateDescription(description: string) {
    this.update.emit({
      description: description
    });
  }
}

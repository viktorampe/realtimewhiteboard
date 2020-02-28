import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card-text',
  templateUrl: './card-text.component.html',
  styleUrls: ['./card-text.component.scss']
})
export class CardTextComponent {
  readonly MAX_CHARACTERS = 100;

  @Input() mode: ModeEnum;
  @Input() text: string;

  @Output() textChange = new EventEmitter<string>();

  constructor() {}

  onChangeText(text: string) {
    this.textChange.emit(text);
  }

  get Mode() {
    return ModeEnum;
  }
}

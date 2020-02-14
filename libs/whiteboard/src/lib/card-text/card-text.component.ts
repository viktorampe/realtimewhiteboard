import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';

@Component({
  selector: 'campus-card-text',
  templateUrl: './card-text.component.html',
  styleUrls: ['./card-text.component.scss']
})
export class CardTextComponent implements OnInit {
  readonly MAX_CHARACTERS = 100;

  @Input() mode: Mode;
  @Input() text: string;

  @Output() textChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onChangeText(text: string) {
    this.textChange.emit(text);
  }

  get Mode() {
    return Mode;
  }
}

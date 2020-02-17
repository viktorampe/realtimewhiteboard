import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';

@Component({
  selector: 'campus-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() mode: Mode;
  @Output() removeClicked = new EventEmitter<void>();
  @Output() updateClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  get Mode() {
    return Mode;
  }

  emitRemoveClicked() {
    this.removeClicked.emit();
  }

  emitUpdateClicked() {
    this.updateClicked.emit();
  }
}

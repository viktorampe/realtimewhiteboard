import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mode } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card-toolbar',
  templateUrl: './card-toolbar.component.html',
  styleUrls: ['./card-toolbar.component.scss']
})
export class CardToolbarComponent implements OnInit {
  @Input() mode: Mode;

  @Output() clickDeleteIcon = new EventEmitter<void>();
  @Output() clickEditIcon = new EventEmitter<void>();
  @Output() clickConfirmIcon = new EventEmitter<void>();
  @Output() clickFlipIcon = new EventEmitter<void>();
  @Output() clickMultiSelectIcon = new EventEmitter<void>();
  @Output() clickMultiSelectSelectedIcon = new EventEmitter<void>();

  constructor() {}

  get Mode() {
    return Mode;
  }

  ngOnInit() {}

  deleteIconClicked() {
    this.clickDeleteIcon.emit();
  }

  editIconClicked(event: MouseEvent) {
    this.clickEditIcon.emit();
    event.stopPropagation();
  }

  confirmIconClicked(event: MouseEvent) {
    this.clickConfirmIcon.emit();
    event.stopPropagation();
  }

  flipIconClicked(event: MouseEvent) {
    this.clickFlipIcon.emit();
    event.stopPropagation();
  }

  multiSelectClicked(event: MouseEvent) {
    this.clickMultiSelectIcon.emit();
    event.stopPropagation();
  }

  multiSelectSelectedClicked(event: MouseEvent) {
    this.clickMultiSelectSelectedIcon.emit();
    event.stopPropagation();
  }
}

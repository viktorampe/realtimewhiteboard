import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';

@Component({
  selector: 'campus-card-toolbar',
  templateUrl: './card-toolbar.component.html',
  styleUrls: ['./card-toolbar.component.scss']
})
export class CardToolbarComponent implements OnInit {
  @Input() mode: ModeEnum;

  @Output() clickDeleteIcon = new EventEmitter<void>();
  @Output() clickEditIcon = new EventEmitter<void>();
  @Output() clickConfirmIcon = new EventEmitter<void>();
  @Output() clickFlipIcon = new EventEmitter<void>();
  @Output() clickMultiSelectIcon = new EventEmitter<void>();
  @Output() clickMultiSelectSelectedIcon = new EventEmitter<void>();

  constructor() {}

  get Mode() {
    return ModeEnum;
  }

  ngOnInit() {}

  deleteIconClicked() {
    this.clickDeleteIcon.emit();
  }

  editIconClicked() {
    this.clickEditIcon.emit();
  }

  confirmIconClicked() {
    this.clickConfirmIcon.emit();
  }

  flipIconClicked() {
    this.clickFlipIcon.emit();
  }

  multiSelectClicked() {
    this.clickMultiSelectIcon.emit();
  }

  multiSelectSelectedClicked() {
    this.clickMultiSelectSelectedIcon.emit();
  }
}

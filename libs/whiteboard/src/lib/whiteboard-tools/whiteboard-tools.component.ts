import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-whiteboard-tools',
  templateUrl: './whiteboard-tools.component.html',
  styleUrls: ['./whiteboard-tools.component.scss']
})
export class WhiteboardToolsComponent implements OnInit {
  @Output() createCard = new EventEmitter();
  @Output() deleteCards = new EventEmitter();
  @Output() editCards = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  btnPlusClicked() {
    this.createCard.emit();
  }

  btnDelClicked() {
    this.deleteCards.emit();
  }

  btnEditClicked() {
    this.editCards.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-whiteboard-toolbar',
  templateUrl: './whiteboard-toolbar.component.html',
  styleUrls: ['./whiteboard-toolbar.component.scss']
})
export class WhiteboardToolbarComponent implements OnInit {
  @Output() deleteCards = new EventEmitter();
  @Output() changeSelectedColor = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  changeSelectedCardsColor(color: string) {
    this.changeSelectedColor.emit(color);
  }

  btnDeleteClicked() {
    this.deleteCards.emit();
  }
}

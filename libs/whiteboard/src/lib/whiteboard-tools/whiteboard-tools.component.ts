import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-whiteboard-tools',
  templateUrl: './whiteboard-tools.component.html',
  styleUrls: ['./whiteboard-tools.component.scss']
})
export class WhiteboardToolsComponent implements OnInit {
  @Output() deleteCards = new EventEmitter();
  @Output() changeSelectedColor = new EventEmitter<string>();
  @Input() cardsSelected: boolean;
  constructor() {}

  ngOnInit() {}

  changeSelectedCardsColor(color: string) {
    this.changeSelectedColor.emit(color);
  }

  btnDeleteClicked() {
    this.deleteCards.emit();
  }
}

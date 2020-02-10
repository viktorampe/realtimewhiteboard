import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-whiteboard-tools',
  templateUrl: './whiteboard-tools.component.html',
  styleUrls: ['./whiteboard-tools.component.scss']
})
export class WhiteboardToolsComponent implements OnInit {
  @Output() deleteCards = new EventEmitter();
  @Input() cardsSelected: boolean;
  constructor() {}

  ngOnInit() {}

  btnDeleteClicked() {
    this.deleteCards.emit();
  }
}

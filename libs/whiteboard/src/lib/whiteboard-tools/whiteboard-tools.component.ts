import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-whiteboard-tools',
  templateUrl: './whiteboard-tools.component.html',
  styleUrls: ['./whiteboard-tools.component.scss']
})
export class WhiteboardToolsComponent implements OnInit {
  @Output() createCard = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  btnPlusClicked() {
    this.createCard.emit();
  }
}

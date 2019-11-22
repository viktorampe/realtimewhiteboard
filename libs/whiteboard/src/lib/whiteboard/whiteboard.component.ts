import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  constructor() {}

  cards: string[];
  // maak array van Cards

  ngOnInit() {
    this.cards = [];
  }

  onDblClick(event) {
    if (event.target.className === 'whiteboard-page__workspace') {
      this.cards.push('item');
    }
  }

  btnPlusClicked() {
    this.cards.push('item');
  }
}

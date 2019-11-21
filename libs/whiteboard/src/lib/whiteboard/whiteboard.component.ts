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

  onTap(event) {
    if (event.tapCount >= 2) {
      console.log(event);
      if (event.target.className == 'whiteboard-page__workspace') {
        this.cards.push('item');
      }
    }
  }

  btnPlusClicked() {
    this.cards.push('item');
  }
}

import { Component, OnInit } from '@angular/core';
import Card from '../../interfaces/Card';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  constructor() {}

  cards: Card[];
  // maak array van Cards

  ngOnInit() {
    this.cards = [];
  }

  onTap(event) {
    if (event.tapCount >= 2) {
      this.addEmptyCard();
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }

  addEmptyCard() {
    this.cards.push({
      color: 'white',
      cardContent: 'test',
      isInputSelected: true
    });
  }

  onDeleteCard(index) {
    this.cards.splice(index, 1);
  }
}

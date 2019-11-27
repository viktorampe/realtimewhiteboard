import { Component, OnInit } from '@angular/core';
import Card from '../../interfaces/card.interface';

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
      const top = event.center.y - event.target.offsetTop - 20;
      const left = event.center.x - event.target.offsetLeft - 20;
      this.addEmptyCard(top, left);
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }

  addEmptyCard(top: number = 0, left: number = 0) {
    this.cards.push({
      color: 'white',
      cardContent: 'test',
      isInputSelected: true,
      top: top,
      left: left
    });
  }

  onDeleteCard(index) {
    this.cards.splice(index, 1);
  }
}

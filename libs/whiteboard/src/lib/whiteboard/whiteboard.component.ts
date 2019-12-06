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
  lastColor: string;

  ngOnInit() {
    this.cards = [];
    this.lastColor = 'white';
  }

  onDblClick(event) {
    if (event.target.className === 'whiteboard-page__workspace') {
      const top = event.offsetY;
      const left = event.offsetX;
      this.addEmptyCard(top, left);
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }

  addEmptyCard(top: number = 0, left: number = 0) {
    this.cards.push({
      color: this.lastColor,
      cardContent: '',
      isInputSelected: true,
      top: top,
      left: left
    });
  }

  onDeleteCard(index) {
    this.cards.splice(index, 1);
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }
}

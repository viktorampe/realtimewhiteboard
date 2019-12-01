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
  lastColor: string;

  ngOnInit() {
    this.cards = [];
    this.lastColor = 'white';
  }

  onTap(event) {
    if (event.tapCount >= 2) {
      this.cards.push('item');
    }
  }

  btnPlusClicked() {
    this.cards.push('item');
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  constructor() {}

  cards: String[];

  ngOnInit() {
    this.cards = [];
  }

  onTap(event) {
    if (event.tapCount >= 2) {
      this.cards.push('item');
    }
  }

  btnPlusClicked() {
    console.log('clicked');
  }
}

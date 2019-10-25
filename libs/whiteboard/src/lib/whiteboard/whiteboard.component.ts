import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  constructor() {}

  cards: String[];
  c: String;

  ngOnInit() {
    this.cards = [];
    this.c = 'item';
  }

  onTap(event) {
    if (event.tapCount >= 2) {
      this.cards.push(this.c);
    }
  }
}

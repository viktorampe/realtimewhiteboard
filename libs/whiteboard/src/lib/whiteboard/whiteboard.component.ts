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
    this.c = '<campus-card />';
  }

  onTap(event) {
    if (event.tapCount >= 2) {
      console.log('Do something');
      console.log(this.cards);
      this.cards.push(this.c);
    }
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onTap(event) {
    if (event.tapCount >= 2) {
      console.log('Do something');
    }
  }
}

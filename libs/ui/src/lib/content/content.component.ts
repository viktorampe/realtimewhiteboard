import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'campus-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @Output() buttonClick = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  onButtonClick(){
    this.buttonClick.emit();
  }
}

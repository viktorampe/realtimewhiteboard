import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() clickColorIcon = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  showColor() {
    this.clickColorIcon.emit(this.colorIconClicked);
  }
}

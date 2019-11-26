import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onDeleteClicked() {
    this.delete.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-image-toolbar',
  templateUrl: './image-toolbar.component.html',
  styleUrls: ['./image-toolbar.component.scss']
})
export class ImageToolbarComponent implements OnInit {
  @Output() removeClicked = new EventEmitter<void>();
  @Output() updateClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}

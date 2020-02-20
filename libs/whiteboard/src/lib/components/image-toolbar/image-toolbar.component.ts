import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-image-toolbar',
  templateUrl: './image-toolbar.component.html',
  styleUrls: ['./image-toolbar.component.scss']
})
export class ImageToolbarComponent implements OnInit {
  @Input() hasImage: boolean;
  @Output() removeClicked = new EventEmitter<void>();
  @Output() updateClicked = new EventEmitter<void>();

  constructor() {}

  emitRemoveClicked() {
    this.removeClicked.emit();
  }

  emitUpdateClicked() {
    this.updateClicked.emit();
  }

  ngOnInit() {}
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-image-toolbar',
  templateUrl: './image-toolbar.component.html',
  styleUrls: ['./image-toolbar.component.scss']
})
export class ImageToolbarComponent {
  @Input() hasImage: boolean;
  @Output() remove = new EventEmitter<void>();
  @Output() openFilePicker = new EventEmitter<void>();

  constructor() {}

  clickRemove() {
    this.remove.emit();
  }

  clickChoose() {
    this.openFilePicker.emit();
  }
}

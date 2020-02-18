import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[campusImageDrag]'
})
export class ImageDragDirective {
  @Output() filesDroppedEvent = new EventEmitter<DragEvent>();

  @HostBinding('class.image-drag-directive-dragging') private dragClass = false;

  constructor() {}

  //Dragover listener
  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = true;
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = false;
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = false;
    const files = evt.dataTransfer.files;
    if (files.length) {
      this.filesDroppedEvent.emit(evt);
    }
  }
}

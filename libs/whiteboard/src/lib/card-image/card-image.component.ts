import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'campus-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent implements OnInit {
  @Input() editMode: boolean;
  @Input() imageUrl: string;
  @Output() imageClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onImageClicked() {
    this.imageClicked.emit();
  }
}

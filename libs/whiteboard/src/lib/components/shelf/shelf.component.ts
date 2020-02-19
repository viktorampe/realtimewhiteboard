import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import CardInterface from '../../models/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  @Input() cards: CardInterface[];
  @Input() isMinimized = false;
  @Output() isMinimizedChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  toggleShelf() {
    this.isMinimized = !this.isMinimized;
    this.isMinimizedChange.emit(this.isMinimized);
  }
}

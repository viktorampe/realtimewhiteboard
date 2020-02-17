import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import CardInterface from '../../shared/models/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  @Input() cards: CardInterface[];
  @Output() minimizeShelf = new EventEmitter<boolean>();

  isMinimized: boolean = false;

  constructor() {}

  ngOnInit() {}

  toggleShelf() {
    this.isMinimized = !this.isMinimized;
    this.minimizeShelf.emit(this.isMinimized);
  }
}

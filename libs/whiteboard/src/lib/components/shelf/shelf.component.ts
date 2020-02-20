import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
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
  @Output() cardDraggedOutsideContainer = new EventEmitter<any>();

  private cardElementBeingDragged: HTMLElement;

  constructor() {}

  ngOnInit() {}

  toggleShelf() {
    this.isMinimized = !this.isMinimized;
    this.isMinimizedChange.emit(this.isMinimized);
  }

  onCardDragStart(event: CdkDragStart) {
    this.cardElementBeingDragged = event.source.element.nativeElement;
  }

  onCardDragged(event: CdkDragDrop<any>, card: CardInterface) {
    if (!event.isPointerOverContainer) {
      this.cardDraggedOutsideContainer.emit({
        event: event,
        card: card,
        cardElement: this.cardElementBeingDragged
      });
    }
    this.cardElementBeingDragged = null;
  }
}

import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CardInterface } from '../../models/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss']
})
export class ShelfComponent implements OnInit {
  @ViewChild('shelf', { static: false }) shelf: ElementRef;

  @Input() cards: CardInterface[];
  @Input() isMinimized = false;
  @Output() isMinimizedChange = new EventEmitter<boolean>();
  @Output() cardDraggedOutsideContainer = new EventEmitter<any>();
  @Output() deleteCard = new EventEmitter<CardInterface>();

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
    console.log(this.cardElementBeingDragged);
    if (!event.isPointerOverContainer) {
      this.cardDraggedOutsideContainer.emit({
        event: event,
        card: card,
        cardElement: this.cardElementBeingDragged,
        scrollLeft: this.shelf.nativeElement.scrollLeft
      });
    }
    this.cardElementBeingDragged = null;
  }

  emitDeleteCard(card) {
    this.deleteCard.emit(card);
  }
}

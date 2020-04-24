import {
  animate,
  animateChild,
  group,
  keyframes,
  query,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardInterface } from '../../models/card.interface';

@Component({
  selector: 'campus-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.scss'],
  animations: [
    trigger('showHideShelf', [
      state('visible', style({ transform: 'translateY(0)' })),
      state('hidden', style({ transform: 'translateY(calc(100% + 24px))' })),
      transition('hidden => visible', [
        group([
          animate(
            '300ms cubic-bezier(.43,0,.31,1)',
            keyframes([
              style({ transform: 'translateY(calc(100% + 24px))', offset: 0 }),
              style({ transform: 'translateY(-8px)', offset: 0.75 }),
              style({ transform: 'translateY(5px)', offset: 0.9 }),
              style({ transform: 'translateY(0)', offset: 1 })
            ])
          ),
          query('@floatActionButtons', [animateChild()])
        ])
      ]),
      transition('visible => hidden', [
        group([
          animate(
            '300ms cubic-bezier(.43,0,.31,1)',
            style({ transform: 'translateY(calc(100% + 24px))' })
          ),
          query('@floatActionButtons', [animateChild()])
        ])
      ])
    ]),
    trigger('floatActionButtons', [
      state('attached', style({ top: '-24px' })),
      state('detached', style({ top: '-66px' })),
      transition('attached => detached', [
        animate(
          '300ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ top: '-24px', offset: 0 }),
            style({ top: '-36px', offset: 0.5 }),
            style({ top: '-72px', offset: 0.9 }),
            style({ top: '-66px', offset: 1 })
          ])
        )
      ]),
      transition('detached => attached', [
        animate(
          '300ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ top: '-66px', offset: 0 }),
            style({ top: '-24px', offset: 0.5 }),
            style({ top: '-24px', offset: 0.75 }),
            style({ top: '-30px', offset: 0.9 }),
            style({ top: '-24px', offset: 1 })
          ])
        )
      ])
    ]),
    trigger('appear', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1 }),
        animate(
          '150ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'scale(0)', opacity: 0 })
        )
      ])
    ])
  ]
})
export class ShelfComponent implements OnInit, OnChanges {
  @ViewChild('shelf', { static: false }) shelf: ElementRef;

  @Input() cards: CardInterface[] = [];
  @Input() activeCards: CardInterface[] = [];

  @HostBinding('@showHideShelf')
  get showHideShelf() {
    return this.isMinimized ? 'hidden' : 'visible';
  }

  @Input() isMinimized = false;
  @Input() canManage: boolean;
  @Input() defaultColor = '#00A7E2';

  @Output() isMinimizedChange = new EventEmitter<boolean>();
  @Output() cardDraggedOutsideContainer = new EventEmitter<any>();
  @Output() deleteCard = new EventEmitter<CardInterface>();
  @Output() addClick = new EventEmitter();

  private cardElementBeingDragged: HTMLElement;

  public activeCardsIds$ = new BehaviorSubject<string[]>([]);

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.activeCards || changes.cards) && this.activeCards) {
      this.activeCardsIds$.next(this.activeCards.map(card => card.id));
    }
  }

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
        cardElement: this.cardElementBeingDragged,
        scrollLeft: this.shelf.nativeElement.scrollLeft
      });
    }
    this.cardElementBeingDragged = null;
  }

  emitDeleteCard(card) {
    this.deleteCard.emit(card);
  }

  clickAdd() {
    this.addClick.emit();
  }
}

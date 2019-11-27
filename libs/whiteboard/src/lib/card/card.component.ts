import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import Card from '../../interfaces/card.interface';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @ViewChild('inputContent') inputContent: ElementRef;
  @Input() card: Card;
  @Output() deleteCard = new EventEmitter();

  @HostBinding('style.top') topStyle: string;
  @HostBinding('style.left') leftStyle: string;

  constructor() {}

  ngOnInit() {
    this.card = {
      cardContent: null,
      color: null,
      isInputSelected: true,
      top: 0,
      left: 0
    };
  }

  ngOnChanges() {
    this.topStyle = this.card.top + 'px';
    this.leftStyle = this.card.left + 'px';
  }

  toggleInput() {
    if (this.card.cardContent != null) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
  }

  onDeleteCard() {
    this.deleteCard.emit();
  }
}

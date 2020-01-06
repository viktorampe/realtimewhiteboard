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
  @Output() lastColor = new EventEmitter<string>();

  @HostBinding('style.top') topStyle: string;
  @HostBinding('style.left') leftStyle: string;
  colorlistHidden: boolean;
  viewModeImage: boolean;
  maxCharacters = 300;

  constructor() {
    this.card = {
      color: 'white',
      cardContent: '',
      isInputSelected: true,
      editMode: true,
      top: 0,
      left: 0
    };

    this.viewModeImage = true;
  }

  ngOnInit() {
    this.colorlistHidden = true;
  }

  ngOnChanges() {
    this.topStyle = this.card.top + 'px';
    this.leftStyle = this.card.left + 'px';
  }

  toggleInput() {
    if (
      this.card.cardContent !== '' &&
      this.card.cardContent.length <= this.maxCharacters
    ) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
  }

  onDeleteCard() {
    this.deleteCard.emit();
  }

  onDblClick(event) {
    if (
      event.target.className.includes('cardImage') ||
      event.target.className.includes('card__input') ||
      event.target.className.includes('card')
    ) {
      this.toggleEditMode();
    }
  }

  showColor() {
    this.colorlistHidden = !this.colorlistHidden;
  }

  selectColor(color: string) {
    this.colorlistHidden = true;
    this.card.color = color;
    this.lastColor.emit(color);
  }

  toggleEditMode() {
    this.card.editMode = !this.card.editMode;
    this.viewModeImage = true;
  }

  toggleView() {
    this.viewModeImage = !this.viewModeImage;
  }
}

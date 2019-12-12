import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Card from '../../interfaces/Card';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('inputContent') inputContent: ElementRef;

  card: Card;
  colorlistHidden: boolean;
  viewModeImage: boolean;

  constructor() {
    this.viewModeImage = true;
  }

  ngOnInit() {
    this.colorlistHidden = true;
    this.card = {
      color: 'white',
      cardContent: null,
      isInputSelected: true,
      editMode: true
    };
  }

  toggleInput() {
    if (this.card.cardContent != null) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
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
  }

  toggleEditMode() {
    this.card.editMode = !this.card.editMode;
    this.viewModeImage = true;
  }

  toggleView() {
    this.viewModeImage = !this.viewModeImage;
  }
}

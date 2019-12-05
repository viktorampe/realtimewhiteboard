import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Card from '../../interfaces/Card';
import { CardimageComponent } from '../cardimage/cardimage.component';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('inputContent') inputContent: ElementRef;
  @ViewChild(CardimageComponent) cardImageComponent: CardimageComponent;
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
    if (event.target.className === 'card') {
      this.toggleInput();
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
    this.cardImageComponent.setEditMode(this.card.editMode);
  }

  toggleView() {
    console.log('hide image, show text');
    this.viewModeImage = !this.viewModeImage;
  }
}

//TODO: in edit mode is toggle hidden.
//TODO: in edit mode is cardimage altijd not hidden

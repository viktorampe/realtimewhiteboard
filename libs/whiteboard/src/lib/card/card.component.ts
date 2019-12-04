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

  constructor() {}

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
  }
}

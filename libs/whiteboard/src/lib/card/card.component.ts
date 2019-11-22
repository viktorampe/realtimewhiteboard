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
  maxCharacters = 300;

  constructor() {}

  ngOnInit() {
    this.card = {
      color: '',
      cardContent: '',
      isInputSelected: true
    };
  }

  toggleInput() {
    if (
      this.card.cardContent != null &&
      this.card.cardContent.length < this.maxCharacters
    ) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
  }
}

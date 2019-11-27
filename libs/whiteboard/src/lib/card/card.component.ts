import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Card from '../../interfaces/Card';
import { ColorlistComponent } from '../colorlist/colorlist.component';

@Component({
  selector: 'campus-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('inputContent') inputContent: ElementRef;
  card: Card;
  colorIconClicked: boolean;
  colorlist: ColorlistComponent;
  colorlistHidden: boolean;

  constructor() {}

  ngOnInit() {
    this.colorlistHidden = true;
    this.card = {
      color: 'white',
      cardContent: null,
      isInputSelected: true
    };
  }

  toggleInput() {
    if (this.card.cardContent != null) {
      this.card.isInputSelected = !this.card.isInputSelected;
    }
  }

  showColor(clicked: boolean) {
      this.colorlistHidden = !this.colorlistHidden;
    }
  }
  selectColor(color: string) {
    this.colorlistHidden = true;
    this.card.color = color;
  }
}

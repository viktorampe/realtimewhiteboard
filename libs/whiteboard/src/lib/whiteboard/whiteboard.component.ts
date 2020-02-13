import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Card from '../../model/card.interface';
import { Mode } from '../../util/enums/mode.enum';
@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnInit {
  @ViewChild('titleInput', { static: false }) set titleInput(
    titleInput: ElementRef
  ) {
    if (titleInput) {
      titleInput.nativeElement.focus();
    }
  }

  constructor() {
    this.title = '';
    this.isTitleInputSelected = true;
  }

  cards: Card[] = [];
  selectedCards: Card[] = [];
  shelvedCards: Card[] = [];

  lastColor = 'white';

  title: string;
  isTitleInputSelected: boolean;

  ngOnInit() {}

  onDblClick(event: MouseEvent) {
    if (event.target.className === 'whiteboard-page__workspace') {
      const top = event.offsetY;
      const left = event.offsetX;
      this.addEmptyCard(top, left);
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }

  addEmptyCard(top: number = 0, left: number = 0) {
    this.cards.push({
      mode: Mode.IdleMode,
      color: this.lastColor,
      description: '',
      image: '',
      top: top,
      left: left
    });
  }

  showTitleInput() {
    this.isTitleInputSelected = true;
  }

  hideTitleInput() {
    if (this.title !== '') {
      this.isTitleInputSelected = false;
    }
  }

  onDeleteCard(card: Card) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);
    this.cards = this.cards.filter(c => c !== card);
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }

  selectCard(card) {
    this.selectedCards.push(card);
  }

  deselectCard(card: Card) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);
  }

  btnDelClicked() {
    this.cards = this.cards.filter(c => !this.selectedCards.includes(c));
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;
    this.selectedCards.forEach(c => (c.color = this.lastColor));
  }
}

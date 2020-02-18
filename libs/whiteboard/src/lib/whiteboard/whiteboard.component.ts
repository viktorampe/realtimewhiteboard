import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';
import CardInterface from '../../shared/models/card.interface';
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
  cards: CardInterface[] = [];
  shelvedCards: CardInterface[] = [];
  selectedCards: CardInterface[] = [];

  lastColor = '#00A7E2';
  title = '';
  isTitleInputSelected = true;
  isShelfMinimized = false;

  constructor() {}

  ngOnInit() {}

  get Mode() {
    return Mode;
  }

  onDblClick(event: MouseEvent) {
    if ((event.target as HTMLElement).className === 'whiteboard__workspace') {
      const top = event.offsetY;
      const left = event.offsetX;
      this.addEmptyCard(top, left);
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }

  addEmptyCard(top: number = 0, left: number = 0) {
    const card = {
      mode: Mode.IdleMode,
      color: this.lastColor,
      description: '',
      image: '',
      top: top,
      left: left
    };
    this.cards.push(card);

    if (this.selectedCards.length) {
      card.mode = Mode.MultiSelectMode;
    }
  }

  addCardToShelf(card: CardInterface) {
    card.mode = Mode.ShelfMode;
    this.shelvedCards.push(card);
  }

  showTitleInput() {
    this.isTitleInputSelected = true;
  }

  hideTitleInput() {
    if (this.title !== '') {
      this.isTitleInputSelected = false;
    }
  }

  onDeleteCard(card: CardInterface) {
    //TODO: if(kaartje werd door redactie gemaakt)
    this.addCardToShelf(card);
    //TODO: else
    this.cards = this.cards.filter(c => c !== card);
  }

  onCardTapped(card: CardInterface) {
    const isCardSelected = !!this.cards.filter(
      c => c.mode === Mode.SelectedMode
    ).length;

    if (!isCardSelected) {
      card.mode = Mode.ZoomMode;
    }
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }

  bulkDeleteClicked() {
    this.cards = this.cards.filter(c => !this.selectedCards.includes(c));
    this.selectedCards.forEach(c => this.addCardToShelf(c));
    this.selectedCards = [];
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;
    this.selectedCards.forEach(c => (c.color = this.lastColor));
  }

  cardModeChanged(card: CardInterface, mode: Mode) {
    if (mode === Mode.SelectedMode) {
      this.setCardsModeIdleExceptUploadModeAndCard(card);
    }
  }

  private setCardsModeIdleExceptUploadModeAndCard(card: CardInterface) {
    this.cards
      .filter(c => c !== card && c.mode !== Mode.UploadMode)
      .forEach(c => (c.mode = Mode.IdleMode));
  }

  onSelectCard(card: CardInterface) {
    this.selectedCards.push(card);

    if (this.selectedCards.length === 1) {
      this.cards.forEach(c => (c.mode = Mode.MultiSelectMode));
    }

    card.mode = Mode.MultiSelectSelectedMode;
  }

  onDeselectCard(card: CardInterface) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);
    card.mode = Mode.MultiSelectMode;

    if (!this.selectedCards.length) {
      this.cards.forEach(c => (c.mode = Mode.IdleMode));
    }
  }

  onDragEnded(event: CdkDragEnd, card) {
    const cardPosition = event.source.getFreeDragPosition();
    card.top = cardPosition.y;
    card.left = cardPosition.x;
  }

  onClickWhiteboard() {
    this.selectedCards = [];
    this.cards.forEach(c => (c.mode = Mode.IdleMode));
  }
}

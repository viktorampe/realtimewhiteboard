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
  lastColor = '#00A7E2';
  title = '';
  isTitleInputSelected = true;
  isToolbarVisible = false;

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
    this.cards.push({
      mode: Mode.IdleMode,
      color: this.lastColor,
      description: '',
      image: '',
      top: top,
      left: left
    });
  }

  addCardToShelve(card: CardInterface) {
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
    this.addCardToShelve(card);
    //TODO: else
    this.cards = this.cards.filter(c => c !== card);
  }

  saveLastColor(color: string) {
    this.lastColor = color;
  }

  bulkDeleteClicked() {
    this.cards = this.cards.filter(
      c => c.mode !== Mode.MultiSelectSelectedMode
    );
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;

    this.cards
      .filter(c => c.mode === Mode.MultiSelectSelectedMode)
      .forEach(c => (c.color = this.lastColor));
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
    this.cards.forEach(c => (c.mode = Mode.MultiSelectMode));
    this.checkToolbarVisible();
  }

  onDeselectCard(card: CardInterface) {
    if (
      !this.cards.filter(c => c.mode === Mode.MultiSelectSelectedMode).length
    ) {
      this.cards.forEach(c => (c.mode = Mode.IdleMode));
    }

    this.checkToolbarVisible();
  }

  checkToolbarVisible() {
    this.isToolbarVisible =
      this.cards.filter(c => c.mode === Mode.MultiSelectSelectedMode).length >
      1;
  }
}

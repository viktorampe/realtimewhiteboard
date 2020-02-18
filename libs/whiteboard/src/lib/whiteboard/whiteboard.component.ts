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
    const card = {
      mode: Mode.IdleMode,
      color: this.lastColor,
      description: '',
      image: '',
      top: top,
      left: left
    };
    this.cards.push(card);

    if (
      this.cards.filter(c => c.mode === Mode.MultiSelectSelectedMode).length
    ) {
      card.mode = Mode.MultiSelectMode;
    }
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
    this.cards = this.cards.filter(
      c => c.mode !== Mode.MultiSelectSelectedMode
    );
    this.checkWhiteboardToolbarVisible();
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
      this.checkWhiteboardToolbarVisible();
    }
  }

  private setCardsModeIdleExceptUploadModeAndCard(card: CardInterface) {
    this.cards
      .filter(c => c !== card && c.mode !== Mode.UploadMode)
      .forEach(c => (c.mode = Mode.IdleMode));
  }

  onSelectCard(card: CardInterface) {
    this.cards
      .filter(c => c.mode !== Mode.MultiSelectSelectedMode)
      .forEach(c => (c.mode = Mode.MultiSelectMode));
    this.checkWhiteboardToolbarVisible();
  }

  onDeselectCard(card: CardInterface) {
    if (
      !this.cards.filter(c => c.mode === Mode.MultiSelectSelectedMode).length
    ) {
      this.cards.forEach(c => (c.mode = Mode.IdleMode));
    }

    this.checkWhiteboardToolbarVisible();
  }

  onDragEnded(event: CdkDragEnd, card) {
    const cardPosition = event.source.getFreeDragPosition();
    card.top = cardPosition.y;
    card.left = cardPosition.x;
  }

  checkWhiteboardToolbarVisible() {
    this.isToolbarVisible =
      this.cards.filter(c => c.mode === Mode.MultiSelectSelectedMode).length >=
      1;
  }

  onClickWhiteboard() {
    this.cards
      .filter(c => c.mode === Mode.SelectedMode)
      .forEach(c => (c.mode = Mode.IdleMode));
  }
}

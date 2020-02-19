import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Mode } from '../../shared/enums/mode.enum';
import CardInterface from '../../shared/models/card.interface';
import WhiteboardInterface from '../../shared/models/whiteboard.interface';

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

  readonly multipleCardCreationOffset = 50;
  readonly allowedFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

  cards: CardInterface[] = [];
  shelvedCards: CardInterface[] = [];
  lastColor = '#00A7E2';
  title = '';
  isTitleInputSelected = true;
  isToolbarVisible = false;
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

  saveWhiteboard() {
    const whiteboard: WhiteboardInterface = {
      title: this.title,
      cards: this.cards,
      shelfCards: this.shelvedCards
    };
    //TODO: http-post whiteboard
    console.log(whiteboard);
    return whiteboard;
  }

  addEmptyCard(
    top: number = 0,
    left: number = 0,
    image: string = ''
  ): CardInterface {
    const card = {
      mode: Mode.IdleMode,
      color: this.lastColor,
      description: '',
      image: image,
      top: top,
      left: left
    };
    this.cards.push(card);

    if (
      this.cards.filter(c => c.mode === Mode.MultiSelectSelectedMode).length
    ) {
      card.mode = Mode.MultiSelectMode;
    }

    return card;
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
    const multiSelectedCards = this.cards.filter(
      c => c.mode === Mode.MultiSelectSelectedMode
    );
    multiSelectedCards.forEach(c => this.addCardToShelf(c));
    this.cards = this.cards.filter(c => !multiSelectedCards.includes(c));
    this.cards.forEach(c => (c.mode = Mode.IdleMode));
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

  onFilesDropped(event) {
    const images = event.dataTransfer.files;
    const { offsetX: x, offsetY: y } = event;

    for (let i = 0; i < images.length; i++) {
      if (!this.allowedFileTypes.includes(images[i].type)) {
        continue;
      }

      const offsetX = x + i * this.multipleCardCreationOffset;
      const offsetY = y + i * this.multipleCardCreationOffset;

      this.readImageAndCreateCard(offsetX, offsetY, images[i]);
    }
  }

  private readImageAndCreateCard(x: number, y: number, image: File) {
    const reader = new FileReader();

    reader.onloadend = e => {
      this.addNewCardAfterImageUpload(x, y, reader.result.toString());
    };

    reader.readAsDataURL(image);
  }

  private addNewCardAfterImageUpload(
    offsetX: number,
    offsetY: number,
    image: string
  ) {
    const card = this.addEmptyCard(offsetY, offsetX, image);

    card.mode = Mode.UploadMode;

    setTimeout(() => {
      card.mode = Mode.IdleMode;
    }, 500);
  }

  onClickWhiteboard() {
    this.cards
      .filter(c => c.mode === Mode.SelectedMode)
      .forEach(c => (c.mode = Mode.IdleMode));
  }
}

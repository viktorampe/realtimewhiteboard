import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Mode } from '../../enums/mode.enum';
import CardInterface from '../../models/card.interface';
import WhiteboardInterface from '../../models/whiteboard.interface';
import { WhiteboardHttpService } from '../../services/whiteboard-http.service';

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

  @ViewChild('workspace', { static: true }) workspaceElementRef: ElementRef;

  readonly multipleCardCreationOffset = 50;
  readonly allowedFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

  cards: CardInterface[] = [];
  shelvedCards: CardInterface[] = [];
  selectedCards: CardInterface[] = [];

  lastColor = '#00A7E2';
  title = '';
  isTitleInputSelected = true;
  isShelfMinimized = false;

  constructor(private whiteboardHttpService: WhiteboardHttpService) {}

  ngOnInit() {
    this.whiteboardHttpService.getJson().subscribe(whiteboard => {
      this.title = whiteboard.title;
      this.cards = whiteboard.cards;
      this.shelvedCards = whiteboard.shelfCards;
    });
  }

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
    this.whiteboardHttpService.setJson(whiteboard);
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
      left: left,
      viewModeImage: true
    };
    this.cards.push(card);

    if (this.selectedCards.length) {
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
    if (card.mode === Mode.ZoomMode) {
      card.mode = Mode.IdleMode;
    } else if (this.isZoomAllowedForCard(card)) {
      card.mode = Mode.ZoomMode;
    }
  }

  private isZoomAllowedForCard(card: CardInterface): Boolean {
    const isACardSelected = this.isACardSelected();

    const isZoomAllowed =
      !isACardSelected &&
      card.viewModeImage &&
      card.image &&
      card.mode !== Mode.EditMode &&
      card.mode !== Mode.MultiSelectMode &&
      card.mode !== Mode.MultiSelectSelectedMode;

    return isZoomAllowed;
  }

  private isACardSelected() {
    return !!this.cards.filter(c => c.mode === Mode.SelectedMode).length;
  }

  cardEditIconClicked(card: CardInterface) {
    card.mode = Mode.EditMode;
  }

  cardConfirmIconClicked(card: CardInterface) {
    card.mode = Mode.IdleMode;
  }

  cardFlipIconClicked(card: CardInterface) {
    card.viewModeImage = !card.viewModeImage;

    if (card.mode !== Mode.EditMode) {
      card.mode = Mode.IdleMode;
    }
  }

  onCardPressed(card: CardInterface) {
    if (card.mode !== Mode.ShelfMode) {
      if (card.mode === Mode.SelectedMode || card.mode === Mode.EditMode) {
        card.mode = Mode.IdleMode;
      } else {
        card.mode = Mode.SelectedMode;
        this.setCardsModeIdleExceptUploadModeAndCard(card);
        this.selectedCards = [];
      }
    }
  }

  removeImageFromCard(card: CardInterface) {
    card.image = '';
  }

  openFilePicker(filePicker: HTMLElement) {
    filePicker.click();
  }

  onFilePickerImageSelected(event: Event, card: CardInterface) {
    const input = event.target as HTMLInputElement;
    const files: FileList = input.files;

    if (files.length && this.allowedFileTypes.includes(files[0].type)) {
      this.uploadImageForCard(card, files[0]);
    }

    input.value = '';
  }

  uploadImageForCard(card: CardInterface, image: File) {
    card.mode = Mode.UploadMode;

    this.whiteboardHttpService
      .uploadFile(image)
      .subscribe((imageUrl: string) => {
        card.image = imageUrl;

        if (this.selectedCards.length) {
          card.mode = Mode.MultiSelectMode;
        } else {
          card.mode = Mode.IdleMode;
        }
      });
  }

  changeColorForCard(card: CardInterface, color: string) {
    this.lastColor = color;
    card.color = color;
    card.mode = Mode.IdleMode;
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

  private setCardsModeIdleExceptUploadModeAndCard(card: CardInterface) {
    this.cards
      .filter(c => c !== card && c.mode !== Mode.UploadMode)
      .forEach(c => (c.mode = Mode.IdleMode));
  }

  onSelectCard(card: CardInterface) {
    this.selectedCards.push(card);

    if (this.selectedCards.length === 1) {
      this.cards
        .filter(c => c.mode !== Mode.UploadMode)
        .forEach(c => (c.mode = Mode.MultiSelectMode));
    }

    card.mode = Mode.MultiSelectSelectedMode;
  }

  onDeselectCard(card: CardInterface) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);

    if (!this.selectedCards.length) {
      this.cards.forEach(c => (c.mode = Mode.IdleMode));
    } else {
      card.mode = Mode.MultiSelectMode;
    }
  }

  onDragEnded(event: CdkDragEnd, card) {
    const cardPosition = event.source.getFreeDragPosition();
    card.top = cardPosition.y;
    card.left = cardPosition.x;
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

      const card = this.addEmptyCard(offsetY, offsetX);
      this.uploadImageForCard(card, images[i]);
    }
  }

  onClickWhiteboard() {
    this.selectedCards = [];
    this.cards
      .filter(c => c.mode !== Mode.UploadMode)
      .forEach(c => (c.mode = Mode.IdleMode));
  }

  cardDraggedPosition($event: {
    event: CdkDragDrop<any>;
    card: CardInterface;
  }) {
    const { card, event } = $event;
    card.left = event.distance.x + 124;
    card.top =
      this.workspaceElementRef.nativeElement.getBoundingClientRect().height -
      Math.abs(event.distance.y) -
      167;
    card.mode = Mode.IdleMode;
    this.cards.push(card);
    this.shelvedCards = this.shelvedCards.filter(c => c !== card);
  }
}

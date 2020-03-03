import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModeEnum } from '../../enums/mode.enum';
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
      this.cards = [];
      this.shelvedCards = [...whiteboard.cards, ...whiteboard.shelfCards];
    });
  }

  get Mode() {
    return ModeEnum;
  }

  //#region WORKSPACE INTERACTIONS

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
  //#endregion

  //#region CARD ACTIONS
  updateCard(updates: Partial<CardInterface>, card: CardInterface) {
    Object.assign(card, updates);
  }

  addEmptyCard(
    top: number = 0,
    left: number = 0,
    image: string = ''
  ): CardInterface {
    const card = {
      mode: ModeEnum.IDLE,
      color: this.lastColor,
      description: '',
      image: image,
      top: top,
      left: left,
      viewModeImage: true
    };
    this.cards.push(card);

    if (this.selectedCards.length) {
      card.mode = ModeEnum.MULTISELECT;
    }

    return card;
  }

  addCardToShelf(card: CardInterface) {
    card.mode = ModeEnum.SHELF;
    this.shelvedCards.push(card);
  }

  onDeleteCard(card: CardInterface) {
    //TODO: if(kaartje werd door redactie gemaakt)
    this.addCardToShelf(card);
    //TODO: else
    this.cards = this.cards.filter(c => c !== card);
  }

  onCardTapped(card: CardInterface) {
    if (card.mode === ModeEnum.ZOOM) {
      card.mode = ModeEnum.IDLE;
    } else if (this.isZoomAllowedForCard(card)) {
      card.mode = ModeEnum.ZOOM;
    }
  }

  onCardPressed(card: CardInterface) {
    if (card.mode !== ModeEnum.SHELF) {
      if (card.mode === ModeEnum.SELECTED || card.mode === ModeEnum.EDIT) {
        card.mode = ModeEnum.IDLE;
      } else {
        card.mode = ModeEnum.SELECTED;
        this.setCardsModeIdleExceptUploadModeAndCard(card);
        this.selectedCards = [];
      }
    }
  }

  onCardClicked(event: MouseEvent, card: CardInterface) {
    if (card.mode !== ModeEnum.IDLE) {
      event.stopPropagation();
    }
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

  // TODO: check upload flow
  uploadImageForCard(card: CardInterface, image: File) {
    card.mode = ModeEnum.UPLOAD;
    this.whiteboardHttpService
      .uploadFile(image)
      .subscribe((imageUrl: string) => {
        card.image = imageUrl;
        if (this.selectedCards.length) {
          card.mode = ModeEnum.MULTISELECT;
        } else {
          card.mode = ModeEnum.EDIT;
        }
      });
  }

  changeColorForCard(card: CardInterface, color: string) {
    this.lastColor = color;
    card.color = color;
    card.mode = ModeEnum.IDLE;
  }

  onDragEnded(event: CdkDragEnd, card) {
    const cardPosition = event.source.getFreeDragPosition();
    card.top = cardPosition.y;
    card.left = cardPosition.x;
  }

  private setCardsModeIdleExceptUploadModeAndCard(card: CardInterface) {
    this.cards
      .filter(c => c !== card && c.mode !== ModeEnum.UPLOAD)
      .forEach(c => (c.mode = ModeEnum.IDLE));
  }

  private isZoomAllowedForCard(card: CardInterface): Boolean {
    const isACardSelected = this.isACardSelected();

    const isZoomAllowed =
      !isACardSelected &&
      card.viewModeImage &&
      card.image &&
      card.mode !== ModeEnum.EDIT &&
      card.mode !== ModeEnum.MULTISELECT &&
      card.mode !== ModeEnum.MULTISELECTSELECTED;

    return isZoomAllowed;
  }

  private isACardSelected() {
    return !!this.cards.filter(c => c.mode === ModeEnum.SELECTED).length;
  }
  //#endregion

  //#region WHITEBOARD ACTIONS
  showTitleInput() {
    this.isTitleInputSelected = true;
  }

  hideTitleInput() {
    if (this.title !== '') {
      this.isTitleInputSelected = false;
    }
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

  saveWhiteboard() {
    const whiteboard: WhiteboardInterface = {
      title: this.title,
      cards: this.cards,
      shelfCards: this.shelvedCards
    };
    this.whiteboardHttpService.setJson(whiteboard);
  }

  onClickWhiteboard() {
    this.selectedCards = [];
    this.cards
      .filter(c => c.mode !== ModeEnum.UPLOAD)
      .forEach(c => (c.mode = ModeEnum.IDLE));
  }

  cardDraggedPosition($event: {
    event: CdkDragDrop<any>;
    card: CardInterface;
    cardElement: HTMLElement;
  }) {
    const { card, event, cardElement } = $event;

    card.left = cardElement.offsetLeft + event.distance.x;

    card.top =
      this.workspaceElementRef.nativeElement.getBoundingClientRect().height -
      (167 + cardElement.offsetTop) -
      Math.abs(event.distance.y);

    card.mode = ModeEnum.IDLE;
    this.cards.push(card);
    this.shelvedCards = this.shelvedCards.filter(c => c !== card);
  }
  //#endregion

  //#region CARD TOOLBAR

  cardEditIconClicked(card: CardInterface) {
    card.mode = ModeEnum.EDIT;
  }

  cardConfirmIconClicked(card: CardInterface) {
    card.mode = ModeEnum.IDLE;
  }

  cardFlipIconClicked(card: CardInterface) {
    card.viewModeImage = !card.viewModeImage;

    if (card.mode !== ModeEnum.EDIT) {
      card.mode = ModeEnum.IDLE;
    }
  }

  //#endregion

  //#region MULTI SELECT ACTIONS
  bulkDeleteClicked() {
    this.cards = this.cards.filter(c => !this.selectedCards.includes(c));
    this.selectedCards.forEach(c => this.addCardToShelf(c));
    this.selectedCards = [];
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;
    this.selectedCards.forEach(c => (c.color = this.lastColor));
  }

  onSelectCard(card: CardInterface) {
    this.selectedCards.push(card);

    if (this.selectedCards.length === 1) {
      this.cards
        .filter(c => c.mode !== ModeEnum.UPLOAD)
        .forEach(c => (c.mode = ModeEnum.MULTISELECT));
    }

    card.mode = ModeEnum.MULTISELECTSELECTED;
  }

  onDeselectCard(card: CardInterface) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);

    if (!this.selectedCards.length) {
      this.cards.forEach(c => (c.mode = ModeEnum.IDLE));
    } else {
      card.mode = ModeEnum.MULTISELECT;
    }
  }

  //#endregion
}

import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ModeEnum } from '../../enums/mode.enum';
import CardInterface from '../../models/card.interface';
import ImageInterface from '../../models/image.interface';
import WhiteboardInterface from '../../models/whiteboard.interface';
import { WhiteboardHttpService } from '../../services/whiteboard-http.service';

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss']
})
export class WhiteboardComponent implements OnChanges {
  @ViewChild('titleInput', { static: false }) set titleInput(
    titleInput: ElementRef
  ) {
    if (titleInput) {
      titleInput.nativeElement.focus();
    }
  }

  @ViewChild('workspace', { static: false }) workspaceElementRef: ElementRef;
  @Input() metadataId: number;
  @Input() apiBase: string;

  readonly multipleCardCreationOffset = 50;
  readonly allowedFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

  public whiteboard$ = new BehaviorSubject<WhiteboardInterface>(null);

  public titleFC: FormControl;

  selectedCards: CardInterface[] = [];

  lastColor = '#00A7E2';
  isTitleInputSelected = true;
  isShelfMinimized = false;

  constructor(private whiteboardHttpService: WhiteboardHttpService) {
    this.initialiseForm();
    this.initialiseObservable();
  }

  ngOnChanges() {
    if (this.apiBase && this.metadataId) {
      this.whiteboardHttpService.setSettings({
        apiBase: this.apiBase,
        metadataId: this.metadataId
      });
    }
  }

  get Mode() {
    return ModeEnum;
  }

  private updateWhiteboardSubject(updates: Partial<WhiteboardInterface>) {
    this.whiteboard$.next({
      ...this.whiteboard$.value,
      ...updates
    });
  }

  private initialiseObservable(): void {
    this.whiteboardHttpService
      .getJson()
      .pipe(take(1))
      .subscribe(whiteboardData => {
        this.titleFC.patchValue(whiteboardData.title);
        this.whiteboard$.next(whiteboardData);
      });
  }

  private initialiseForm(): void {
    this.titleFC = new FormControl('', Validators.required);
  }

  private updateViewMode(cards) {
    cards.forEach(c => {
      if (!c.image.imageUrl) {
        c.viewModeImage = false;
      }
    });
    cards.forEach(c => {
      if (!c.description) {
        c.viewModeImage = true;
      }
    });
  }

  //#region WORKSPACE INTERACTIONS

  onDblClick(event: MouseEvent) {
    if ((event.target as HTMLElement).className === 'whiteboard__workspace') {
      const top = event.offsetY;
      const left = event.offsetX;
      this.addEmptyCard(top, left);
    }
  }

  btnPlusClicked(event) {
    event.stopPropagation();
    this.addEmptyCard();
  }
  //#endregion

  //#region CARD ACTIONS
  updateCard(updates: Partial<CardInterface>, card: CardInterface) {
    Object.assign(card, updates);

    const shelfCard: CardInterface = this.whiteboard$.value.shelfCards.filter(
      shelfcard => shelfcard.id === card.id
    )[0];

    if (shelfCard) {
      Object.assign(shelfCard, updates);
    }

    this.updateWhiteboardSubject({});
  }

  addEmptyCard(
    top: number = 0,
    left: number = 0,
    image: string = ''
  ): CardInterface {
    // add card to the workspace
    const card = {
      id: uuidv4(),
      mode: ModeEnum.EDIT,
      color: this.lastColor,
      description: '',
      image: { imageUrl: image },
      top: top,
      left: left,
      viewModeImage: false
    };

    // add a 'copy' ( card with a different reference ) to the shelf
    this.addCardToShelf({ ...card, mode: ModeEnum.SHELF });

    if (this.selectedCards.length) {
      card.mode = ModeEnum.MULTISELECT;
    }

    this.updateWhiteboardSubject({
      cards: [...this.whiteboard$.value.cards, card]
    });

    this.saveWhiteboard();

    return card;
  }

  addCardToShelf(card: CardInterface) {
    if (
      !this.whiteboard$.value.shelfCards
        .map(shelfcard => shelfcard.id)
        .includes(card.id)
    ) {
      card.mode = ModeEnum.SHELF;
      this.updateWhiteboardSubject({
        shelfCards: [...this.whiteboard$.value.shelfCards, card]
      });
      this.saveWhiteboard();
    }
  }

  onDeleteCard(card: CardInterface) {
    //TODO: if(kaartje werd door redactie gemaakt)
    //TODO: if(redactie een kaartje permanent delete ->saveWhiteboard())
    this.addCardToShelf(card);
    //TODO: else
    this.updateWhiteboardSubject({
      cards: this.whiteboard$.value.cards.filter(c => c !== card)
    });
  }

  onCardTapped(card: CardInterface) {
    if (card.mode === ModeEnum.ZOOM) {
      card.mode = ModeEnum.IDLE;
    } else if (this.isZoomAllowedForCard(card)) {
      card.mode = ModeEnum.ZOOM;
    }

    this.updateWhiteboardSubject({});
  }

  onCardPressed(card: CardInterface) {
    if (card.mode !== ModeEnum.SHELF) {
      if (card.mode === ModeEnum.SELECTED || card.mode === ModeEnum.EDIT) {
        card.mode = ModeEnum.IDLE;
        this.updateWhiteboardSubject({});
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
      .subscribe((response: ImageInterface) => {
        this.updateCard({ image: response }, card);
        if (response.imageUrl) {
          if (this.selectedCards.length) {
            card.mode = ModeEnum.MULTISELECT;
          } else {
            card.mode = ModeEnum.IDLE;
          }
          this.saveWhiteboard();
        }
      });
  }

  changeColorForCard(card: CardInterface, color: string) {
    this.lastColor = color;
    card.color = color;
    card.mode = ModeEnum.IDLE;
    this.updateWhiteboardSubject({});
    this.updateCard({ color: color }, card);
    this.saveWhiteboard();
  }

  onDragEnded(event: CdkDragEnd, card) {
    const cardPosition = event.source.getFreeDragPosition();
    card.top = cardPosition.y;
    card.left = cardPosition.x;
    this.updateWhiteboardSubject({
      cards: [
        ...this.whiteboard$.value.cards.filter(c => c.id !== card.id),
        card
      ]
    });
  }

  private setCardsModeIdleExceptUploadModeAndCard(card: CardInterface) {
    const cards = this.whiteboard$.value.cards;

    cards
      .filter(c => c !== card && c.mode !== ModeEnum.UPLOAD)
      .forEach(c => (c.mode = ModeEnum.IDLE));

    this.updateWhiteboardSubject({ cards: cards });
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
    return !!this.whiteboard$.value.cards.filter(
      c => c.mode === ModeEnum.SELECTED
    ).length;
  }
  //#endregion

  //#region WHITEBOARD ACTIONS
  showTitleInput() {
    this.isTitleInputSelected = true;
  }

  hideTitleInput() {
    if (!!this.titleFC.value) {
      this.isTitleInputSelected = false;
      this.updateWhiteboardSubject({ title: this.titleFC.value });
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
      card.viewModeImage = true;
      this.uploadImageForCard(card, images[i]);
    }
    this.saveWhiteboard();
  }

  saveWhiteboard() {
    this.whiteboardHttpService.setJson(this.whiteboard$.value);
  }

  onClickWhiteboard() {
    this.selectedCards = [];
    const cards = this.whiteboard$.value.cards;

    const nonIdleUploadCards = cards.filter(
      c => c.mode !== ModeEnum.UPLOAD && c.mode !== ModeEnum.IDLE
    );

    this.updateViewMode(cards);

    if (nonIdleUploadCards.length) {
      nonIdleUploadCards.forEach(c => (c.mode = ModeEnum.IDLE));
      this.updateWhiteboardSubject({ cards: cards });
    }
  }

  cardDraggedPosition($event: {
    event: CdkDragDrop<any>;
    card: CardInterface;
    cardElement: HTMLElement;
  }) {
    const { card, event, cardElement } = $event;
    const currentMode = this.selectedCards.length
      ? ModeEnum.MULTISELECT
      : ModeEnum.IDLE;

    const workspaceCard: CardInterface = {
      ...card,
      mode: currentMode,
      left: cardElement.offsetLeft + event.distance.x,
      top:
        this.workspaceElementRef.nativeElement.getBoundingClientRect().height -
        (167 + cardElement.offsetTop) -
        Math.abs(event.distance.y)
    };

    if (
      !this.whiteboard$.value.cards
        .map(workspacecard => workspacecard.id)
        .includes(workspaceCard.id)
    ) {
      this.updateWhiteboardSubject({
        cards: [...this.whiteboard$.value.cards, workspaceCard]
      });
    }
  }
  //#endregion

  //#region CARD TOOLBAR

  cardEditIconClicked(card: CardInterface) {
    card.mode = ModeEnum.EDIT;
  }

  cardConfirmIconClicked(card: CardInterface) {
    card.mode = ModeEnum.IDLE;

    this.updateViewMode(this.whiteboard$.value.cards);
  }

  cardFlipIconClicked(card: CardInterface) {
    this.updateCard({ viewModeImage: !card.viewModeImage }, card);

    if (card.mode !== ModeEnum.EDIT) {
      card.mode = ModeEnum.IDLE;
      this.updateViewMode(this.whiteboard$.value.cards);
    }
  }

  //#endregion

  //#region MULTI SELECT ACTIONS
  bulkDeleteClicked() {
    const cards = this.whiteboard$.value.cards.filter(
      c => !this.selectedCards.includes(c)
    );
    cards.forEach(c => this.onDeleteCard(c));
    cards.forEach(c => (c.mode = this.Mode.IDLE));
    this.updateWhiteboardSubject({
      cards: cards
    });
    this.selectedCards = [];
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;
    this.selectedCards.forEach(c =>
      this.updateCard({ color: this.lastColor }, c)
    );
    this.updateWhiteboardSubject({});
    this.saveWhiteboard();
  }

  onSelectCard(card: CardInterface) {
    this.selectedCards.push(card);

    if (this.selectedCards.length === 1) {
      const cards = this.whiteboard$.value.cards;

      cards
        .filter(c => c.mode !== ModeEnum.UPLOAD)
        .forEach(c => (c.mode = ModeEnum.MULTISELECT));
    }

    this.updateWhiteboardSubject({});

    card.mode = ModeEnum.MULTISELECTSELECTED;
  }

  onDeselectCard(card: CardInterface) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);

    if (!this.selectedCards.length) {
      const cards = this.whiteboard$.value.cards;
      cards.forEach(c => (c.mode = ModeEnum.IDLE));
      this.updateWhiteboardSubject({ cards: cards });
    } else {
      card.mode = ModeEnum.MULTISELECT;
      this.updateWhiteboardSubject({});
    }
  }

  //#endregion
}

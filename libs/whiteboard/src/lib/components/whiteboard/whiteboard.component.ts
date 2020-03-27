import {
  animate,
  animateChild,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger
} from '@angular/animations';
import { CdkDragDrop, CdkDragEnd } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ModeEnum } from '../../enums/mode.enum';
import CardInterface from '../../models/card.interface';
import ImageInterface from '../../models/image.interface';
import { UserInterface } from '../../models/User.interface';
import WhiteboardInterface from '../../models/whiteboard.interface';

export interface CardImageUploadInterface {
  card: CardInterface;
  imageFile: File;
}

export interface CardImageUploadResponseInterface {
  card: CardInterface;
  image: ImageInterface;
}

@Component({
  selector: 'campus-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
  animations: [
    trigger('showHideCard', [
      transition(':leave', [
        style({ opacity: '1' }),
        animate('150ms cubic-bezier(.43,0,.31,1)', style({ opacity: '0' }))
      ])
    ]),
    trigger('showHideWhiteboardTools', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(
          '300ms cubic-bezier(.43,0,.31,1)',
          keyframes([
            style({ transform: 'translateY(-100%)', offset: 0 }),
            style({ transform: 'translateY(8px)', offset: 0.75 }),
            style({ transform: 'translateY(-5px)', offset: 0.9 }),
            style({ transform: 'translateY(0)', offset: 1 })
          ])
        )
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)' }),
        animate(
          '300ms cubic-bezier(.43,0,.31,1)',
          style({ transform: 'translateY(-100%)' })
        )
      ])
    ]),
    trigger('showHideColorList', [
      transition(':enter', [
        query('@showHideColorSwatchOne', stagger(50, [animateChild()]), {
          optional: true
        })
      ]),
      transition(':leave', [
        query('@showHideColorSwatchOne', stagger(-50, [animateChild()]), {
          optional: true
        })
      ])
    ]),
    trigger('showHideToolbar', [
      transition(':enter', [
        query('@showHideToolbarTool', stagger(-50, [animateChild()]), {
          optional: true
        })
      ]),
      transition(':leave', [
        query('@showHideToolbarTool', stagger(50, [animateChild()]), {
          optional: true
        })
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class WhiteboardComponent implements OnChanges {
  @Input() title: string;
  @Input() cards: CardInterface[];
  @Input() shelfCards: CardInterface[];

  // @Input() whiteboard: WhiteboardInterface;
  @Input() canManage: boolean;
  @Input() uploadImageResponse: CardImageUploadResponseInterface;

  @Output() save = new EventEmitter<WhiteboardInterface>();
  @Output() uploadImage = new EventEmitter<CardImageUploadInterface>();

  @ViewChild('titleInput', { static: false }) set titleInput(
    titleInput: ElementRef
  ) {
    if (titleInput) {
      titleInput.nativeElement.focus();
    }
  }

  @ViewChild('workspace', { static: false }) workspaceElementRef: ElementRef;

  readonly multipleCardCreationOffset = 50;
  readonly allowedFileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

  public user$ = new BehaviorSubject<UserInterface>(null);

  public titleFC: FormControl;

  selectedCards: CardInterface[] = [];

  lastColor = '#00A7E2';
  isTitleInputSelected = true;
  isShelfMinimized = false;

  private whiteboard: WhiteboardInterface;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.cards);
    if (this.uploadImageResponse) {
      this.handleImageUploadResponse(this.uploadImageResponse);
    }
  }

  get Mode() {
    return ModeEnum;
  }
  /**
   * Update whiteboard data.
   * When shouldPersist flag is true,
   * the current whiteboard data is also emitted in the save output.
   *
   * @private
   * @param {Partial<WhiteboardInterface>} updates
   * @memberof WhiteboardComponent
   */
  private updateWhiteboard(
    updates: Partial<WhiteboardInterface>,
    shouldPersist = false
  ) {
    if (updates.cards) {
      this.cards = updates.cards;
    }
    if (updates.shelfCards) {
      this.shelfCards = updates.shelfCards;
    }
    if (updates.title) {
      this.title = updates.title;
    }

    if (shouldPersist) {
      this.saveWhiteboard();
    }
  }

  private updateViewMode(card: CardInterface) {
    if (!card.image.imageUrl) {
      this.updateCard({ viewModeImage: false }, card);
    }
    if (!card.description) {
      this.updateCard({ viewModeImage: true }, card);
    }

    this.saveWhiteboard();
  }
  //#region WORKSPACE INTERACTIONS
  createCard(event: any) {
    if (event.target.className.includes('whiteboard__workspace')) {
      if (event.type === 'longpress') {
        const top =
          event.center.y -
          this.workspaceElementRef.nativeElement.getBoundingClientRect().top;
        const left = event.center.x;
        this.addEmptyCard({ top, left });
      }
      if (event.type === 'dblclick') {
        const top = event.offsetY;
        const left = event.offsetX;
        this.addEmptyCard({ top, left });
      }
    }
  }

  btnPlusClicked() {
    this.addEmptyCard();
  }
  //#endregion

  //#region CARD ACTIONS
  updateCard(updates: Partial<CardInterface>, card: CardInterface) {
    // update card
    Object.assign(card, updates);
    // sync shelfcard
    const shelfCard: CardInterface = this.shelfCards.find(
      shelfcard => shelfcard.id === card.id
    );
    if (shelfCard) {
      Object.assign(shelfCard, updates, { mode: ModeEnum.SHELF });
    }
  }

  addEmptyCard(values: Partial<CardInterface> = {}): CardInterface {
    //deselect all selected cards
    this.selectedCards = [];
    // set idle mode
    this.cards
      .filter(c => c.mode !== ModeEnum.UPLOAD)
      .forEach(c => this.updateCard({ mode: ModeEnum.IDLE }, c));

    // add card to the workspace
    const card = {
      id: uuidv4(),
      mode: ModeEnum.EDIT,
      color: this.lastColor,
      description: '',
      image: {},
      top: 0,
      left: 0,
      viewModeImage: false,
      ...values
    };

    // add a 'copy' ( card with a different reference ) to the shelf
    if (this.canManage) {
      this.addCardToShelf({ ...card, mode: ModeEnum.SHELF });
    }

    // Update whiteboardsubject
    this.updateWhiteboard(
      {
        cards: [...this.cards, card]
      },
      true
    );

    return card;
  }

  addCardToShelf(card: CardInterface) {
    if (!this.shelfCards.find(sc => sc.id === card.id)) {
      this.updateCard({ mode: ModeEnum.SHELF }, card);
      this.updateWhiteboard(
        {
          shelfCards: [...this.shelfCards, card]
        },
        true
      );
    }
  }

  removeImage(card: CardInterface) {
    this.updateCard({ image: {} }, card);
    this.saveWhiteboard();
  }

  onDeleteCard(card: CardInterface) {
    this.updateWhiteboard({
      cards: this.cards.filter(c => c !== card)
    });
  }

  onCardTapped(card: CardInterface) {
    if (card.mode === ModeEnum.ZOOM) {
      this.updateCard({ mode: ModeEnum.IDLE }, card);
    } else if (this.isZoomAllowedForCard(card)) {
      this.updateCard({ mode: ModeEnum.ZOOM }, card);
    }
  }

  onCardPressed(card: CardInterface) {
    if (card.mode !== ModeEnum.SHELF) {
      if (card.mode === ModeEnum.SELECTED || card.mode === ModeEnum.EDIT) {
        this.updateCard({ mode: ModeEnum.IDLE }, card);
      } else {
        this.cards
          .filter(c => c.id !== card.id)
          .forEach(c => (c.mode = ModeEnum.IDLE));
        this.updateCard({ mode: ModeEnum.SELECTED }, card);
        this.selectedCards = [];
      }
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
  uploadImageForCard(card: CardInterface, imageFile: File) {
    this.updateCard({ mode: ModeEnum.UPLOAD }, card);
    this.uploadImage.next({ card, imageFile: imageFile });
  }

  private handleImageUploadResponse(
    response: CardImageUploadResponseInterface
  ) {
    if (response.image.imageUrl) {
      // update card
      this.updateCard({ image: response.image }, response.card);
      // set mode to MUTLISELECT when mutliple cards are selected
      if (this.selectedCards.length) {
        this.updateCard(
          { mode: ModeEnum.MULTISELECT, viewModeImage: true },
          response.card
        );
      }
      // else set to IDLE
      else {
        this.updateCard(
          { mode: ModeEnum.IDLE, viewModeImage: true },
          response.card
        );
      }
      this.saveWhiteboard();
    }
  }

  changeColorForCard(card: CardInterface, color: string) {
    this.lastColor = color;
    this.updateCard({ mode: ModeEnum.IDLE, color: color }, card);
    this.saveWhiteboard();
  }

  onDragStarted(card: CardInterface) {
    if (!this.selectedCards.length) {
      const cards = this.cards;
      cards
        .filter(c => c.id !== card.id && c.mode !== ModeEnum.UPLOAD)
        .forEach(c => (c.mode = this.Mode.IDLE));
      this.updateWhiteboard({ cards: cards });
    }
  }

  onDragEnded(event: CdkDragEnd, card: CardInterface) {
    const cardPosition = event.source.getFreeDragPosition();
    this.updateCard({ top: cardPosition.y, left: cardPosition.x }, card);
    this.updateWhiteboard({
      cards: [...this.cards.filter(c => c.id !== card.id), card]
    });
  }

  private isZoomAllowedForCard(card: CardInterface): Boolean {
    const isACardSelected = this.isACardSelected();

    const isZoomAllowed =
      !isACardSelected &&
      card.viewModeImage &&
      card.image.imageUrl &&
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
    if (!!this.titleFC.value) {
      this.isTitleInputSelected = false;
      this.updateWhiteboard({ title: this.titleFC.value }, true);
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

      const card = this.addEmptyCard({ top: offsetY, left: offsetX });
      this.updateCard({ viewModeImage: true }, card);
      this.uploadImageForCard(card, images[i]);
    }
    this.saveWhiteboard();
  }

  saveWhiteboard() {
    const whiteboard: WhiteboardInterface = {
      title: this.title,
      cards: this.cards,
      shelfCards: this.shelfCards
    };
    whiteboard.cards = whiteboard.shelfCards;
    delete whiteboard.shelfCards;
    this.save.emit(whiteboard);
  }

  onClickWhiteboard(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      target.classList.contains('whiteboard__workspace') ||
      target.classList.contains('card') ||
      target.classList.contains('card-text') ||
      target.classList.contains('card-image') ||
      target.classList.contains('card-image__image')
    ) {
      this.selectedCards = [];
      const cards = this.cards;
      const cardInEditMode = cards.filter(c => c.mode === ModeEnum.EDIT)[0];

      if (cardInEditMode) {
        this.updateCard(
          { description: cardInEditMode.description },
          cardInEditMode
        );
        this.updateViewMode(cardInEditMode);
        this.saveWhiteboard();
      }
      const nonIdleUploadCards = cards.filter(
        c =>
          c.mode !== ModeEnum.UPLOAD &&
          c.mode !== ModeEnum.IDLE &&
          c.mode !== ModeEnum.ZOOM
      );
      if (nonIdleUploadCards.length) {
        nonIdleUploadCards.forEach(c =>
          this.updateCard({ mode: ModeEnum.IDLE }, c)
        );
      }
    }
  }

  cardDraggedPosition($event: {
    event: CdkDragDrop<any>;
    card: CardInterface;
    cardElement: HTMLElement;
    scrollLeft: number;
  }) {
    this.cards
      .filter(c => c.mode !== ModeEnum.UPLOAD)
      .forEach(c => (c.mode = ModeEnum.IDLE));
    const { card, event, cardElement, scrollLeft } = $event;

    const currentMode = this.selectedCards.length
      ? ModeEnum.MULTISELECT
      : ModeEnum.IDLE;

    const workspaceCard: CardInterface = {
      ...card,
      mode: currentMode,
      left: cardElement.offsetLeft + event.distance.x - scrollLeft,
      top:
        this.workspaceElementRef.nativeElement.getBoundingClientRect().height -
        (167 + cardElement.offsetTop) -
        Math.abs(event.distance.y)
    };

    if (currentMode === ModeEnum.MULTISELECT) {
      //return multiselectselected cards to the right mode so the icon is clicked + green
      this.selectedCards.forEach(c => (c.mode = ModeEnum.MULTISELECTSELECTED));
      //change all cards to multiselect mode
      this.cards
        .filter(
          c =>
            c.mode !== ModeEnum.MULTISELECTSELECTED &&
            c.mode !== ModeEnum.UPLOAD
        )
        .forEach(c => (c.mode = ModeEnum.MULTISELECT));
    }

    if (
      !this.cards
        .map(workspacecard => workspacecard.id)
        .includes(workspaceCard.id)
    ) {
      this.updateWhiteboard({
        cards: [...this.cards, workspaceCard]
      });
    }
  }

  //#endregion

  //#region CARD TOOLBAR

  cardEditIconClicked(card: CardInterface) {
    this.updateCard({ mode: ModeEnum.EDIT }, card);
  }

  cardConfirmIconClicked(card: CardInterface) {
    this.updateCard(
      { mode: ModeEnum.IDLE, description: card.description },
      card
    );
    this.updateViewMode(card);
    this.saveWhiteboard();
  }

  cardFlipIconClicked(card: CardInterface) {
    if (
      (card.description && card.image.imageUrl) ||
      card.mode === ModeEnum.EDIT
    ) {
      this.updateCard({ viewModeImage: !card.viewModeImage }, card);

      if (card.mode !== ModeEnum.EDIT) {
        this.updateCard({ mode: ModeEnum.IDLE }, card);
        this.updateViewMode(card);
      }
    }
  }

  //#endregion

  //#region MULTI SELECT ACTIONS
  bulkDeleteClicked() {
    const cards = this.cards.filter(c => !this.selectedCards.includes(c));
    cards.forEach(c => this.onDeleteCard(c));
    cards.forEach(c => this.updateCard({ mode: ModeEnum.IDLE }, c));
    this.updateWhiteboard({
      cards: cards
    });
    this.selectedCards = [];
  }

  changeSelectedCardsColor(color: string) {
    this.lastColor = color;
    this.selectedCards.forEach(c =>
      this.updateCard({ color: this.lastColor }, c)
    );
    this.updateWhiteboard({}, true);
  }

  onSelectCard(card: CardInterface) {
    this.selectedCards.push(card);

    if (this.selectedCards.length === 1) {
      const cards = this.cards;

      cards
        .filter(c => c.mode !== ModeEnum.UPLOAD)
        .forEach(c => (c.mode = ModeEnum.MULTISELECT));
    }

    this.updateCard({ mode: ModeEnum.MULTISELECTSELECTED }, card);
  }

  onDeselectCard(card: CardInterface) {
    this.selectedCards = this.selectedCards.filter(c => c !== card);

    if (!this.selectedCards.length) {
      this.cards.forEach(c => this.updateCard({ mode: ModeEnum.IDLE }, c));
    } else {
      this.updateCard({ mode: ModeEnum.MULTISELECT }, card);
    }
  }

  //#endregion

  //#region shelf actions
  toggleShelf() {
    this.isShelfMinimized = !this.isShelfMinimized;
  }
  //#endregion
}

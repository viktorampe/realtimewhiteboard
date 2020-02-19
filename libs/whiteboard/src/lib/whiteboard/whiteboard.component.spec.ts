import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { Mode } from '../../shared/enums/mode.enum';
import CardInterface from '../../shared/models/card.interface';
import { CardImageComponent } from '../card-image/card-image.component';
import { CardTextComponent } from '../card-text/card-text.component';
import { CardToolbarComponent } from '../card-toolbar/card-toolbar.component';
import { CardComponent } from '../card/card.component';
import { ColorListComponent } from '../color-list/color-list.component';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ShelfComponent } from '../shelf/shelf.component';
import { WhiteboardToolbarComponent } from '../whiteboard-toolbar/whiteboard-toolbar.component';
import { WhiteboardComponent } from './whiteboard.component';

describe('WhiteboardComponent', () => {
  let component: WhiteboardComponent;
  let fixture: ComponentFixture<WhiteboardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatProgressBarModule,
        MatInputModule,
        DragDropModule
      ],
      declarations: [
        WhiteboardComponent,
        CardComponent,
        CardToolbarComponent,
        ColorListComponent,
        WhiteboardToolbarComponent,
        ProgressBarComponent,
        ShelfComponent,
        CardImageComponent,
        CardTextComponent,
        ImageToolbarComponent
      ],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a card on plus button clicked', () => {
    const cardsSizeBeforeClicked = component.cards.length;
    component.btnPlusClicked();
    const cardsSizeAfterClicked = component.cards.length;
    expect(cardsSizeAfterClicked).toBe(cardsSizeBeforeClicked + 1);
  });

  it('should set card mode to ShelfMode when card is added to the shelf', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.addCardToShelf(card);

    expect(card.mode).toBe(<Mode>Mode.ShelfMode);
  });

  it('should add card to the shelvedCards when card is added to the shelf', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.addCardToShelf(card);

    expect(component.shelvedCards).toContain(card);
  });

  it('should delete a card from the list of cards when the user clicks delete', () => {
    const cardsSizeBeforeAdding = component.cards.length;

    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cards.push(card);

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardsSizeBeforeAdding);
  });

  it('should set isTitleInputSelected to true on showTitleInput', () => {
    component.isTitleInputSelected = false;
    component.showTitleInput();
    expect(component.isTitleInputSelected).toBe(true);
  });

  it('should set isTitleInputSelected to false on showTitleInput if title is not empty', () => {
    component.isTitleInputSelected = true;
    component.title = 'test';
    component.hideTitleInput();
    expect(component.isTitleInputSelected).toBe(false);
  });

  it('should not set isTitleInputSelected to false on showTitleInput if title is empty', () => {
    component.isTitleInputSelected = true;
    component.title = '';
    component.hideTitleInput();
    expect(component.isTitleInputSelected).toBe(true);
  });

  it('should set card mode to IdleMode on cardTapped if previous mode was ZoomMode', () => {
    const card: CardInterface = {
      mode: Mode.ZoomMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.onCardTapped(card);
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should set card mode to ZoomMode on cardTapped starting from IdleMode if zoom mode is allowed', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    spyOn<any>(component, 'isZoomAllowedForCard').and.returnValue(true);

    component.onCardTapped(card);
    expect(card.mode).toBe(<Mode>Mode.ZoomMode);
  });

  it('should not set card mode to ZoomMode on cardTapped starting from IdleMode if zoom mode is not allowed', () => {
    const card: CardInterface = {
      mode: Mode.ZoomMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    spyOn<any>(component, 'isZoomAllowedForCard').and.returnValue(false);

    component.onCardTapped(card);
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should set card mode to EditMode when cardEditIconClicked is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cardEditIconClicked(card);
    expect(card.mode).toBe(<Mode>Mode.EditMode);
  });

  it('should set card mode to IdleMode when cardConfirmIconClicked is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cardConfirmIconClicked(card);
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should toggle card viewModeImage when cardFlipIconClicked is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cardFlipIconClicked(card);
    expect(card.viewModeImage).toBe(true);
  });

  it('should set card mode to IdleMode when cardFlipIconClicked is called and card was not in EditMode', () => {
    const card: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cardFlipIconClicked(card);
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should not set card mode to IdleMode when cardFlipIconClicked is called and card was in EditMode', () => {
    const card: CardInterface = {
      mode: Mode.EditMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cardFlipIconClicked(card);
    expect(card.mode).toBe(<Mode>Mode.EditMode);
  });

  it('should not change mode when onCardPressed is called and card was in ShelfMode', () => {
    const card: CardInterface = {
      mode: Mode.ShelfMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onCardPressed(card);
    expect(card.mode).toBe(<Mode>Mode.ShelfMode);
  });

  it('should change mode to IdleMode when onCardPressed is called and card was in SelectedMode', () => {
    const card: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onCardPressed(card);
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should change mode to IdleMode when onCardPressed is called and card was in EditMode', () => {
    const card: CardInterface = {
      mode: Mode.EditMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onCardPressed(card);
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should change mode to SelectedMode when onCardPressed is called and card was not in ShelfMode, SelectedMode or EditMode', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onCardPressed(card);
    expect(card.mode).toBe(<Mode>Mode.SelectedMode);
  });

  it('should remove image from a card when removeImageFromCard is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: 'test',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.removeImageFromCard(card);

    expect(card.image).toBeFalsy();
  });

  it('should set card mode to UploadMode when updateImageFromCard is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.updateImageFromCard(card);
    expect(card.mode).toBe(<Mode>Mode.UploadMode);
  });

  it('should set color of card when changeColorForCard is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.changeColorForCard(card, 'black');
    expect(card.color).toBe('black');
  });

  it('should set lastColor of whiteboard when changeColorForCard is called', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.changeColorForCard(card, 'black');
    expect(component.lastColor).toBe('black');
  });

  it('should set mode of card to IdleMode when changeColorForCard is called', () => {
    const card: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.changeColorForCard(card, 'black');
    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
    const card1: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const card2: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.selectedCards = [card1, card2];

    component.bulkDeleteClicked();

    expect(component.selectedCards.length).toBe(0);
  });

  it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
    const idleCard: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const selectedCard: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cards = [idleCard, selectedCard];

    component.onCardPressed(idleCard);

    expect(selectedCard.mode).toEqual(Mode.IdleMode);
  });

  it('should change the colors of the selected cards when a swatch is clicked', () => {
    const card: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const card2: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.selectedCards = [card, card2];

    component.changeSelectedCardsColor('black');

    component.selectedCards.forEach(c => expect(c.color).toBe('black'));
  });

  it('should add card to selectedCards when onSelectCard is called', () => {
    const card: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onSelectCard(card);

    expect(component.selectedCards).toContain(card);
  });

  it('should set card mode to MultiSelectSelectedMode when onSelectCard is called', () => {
    const card: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onSelectCard(card);

    expect(card.mode).toBe(<Mode>Mode.MultiSelectSelectedMode);
  });

  it("should set all cards' mode to MultiSelectMode when onSelectCard is called", () => {
    const card1: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    const card2: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cards = [card1, card2];

    component.onSelectCard(card1);

    expect(card2.mode).toBe(<Mode>Mode.MultiSelectMode);
  });

  it('should add card to selectedCards when onSelectCard is called', () => {
    const card: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.onSelectCard(card);

    expect(component.selectedCards).toContain(card);
  });

  it('should remove card from selectedCards when onDeselectCard is called', () => {
    const card: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cards = [card];
    component.selectedCards = [card];

    component.onDeselectCard(card);

    expect(component.selectedCards).not.toContain(card);
  });

  it('should set card mode to MultiSelectMode when onDeselectCard is called and another card is still selected', () => {
    const card1: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    const card2: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cards = [card1, card2];
    component.selectedCards = [card1, card2];

    component.onDeselectCard(card1);

    expect(card1.mode).toBe(<Mode>Mode.MultiSelectMode);
  });

  it('should set card mode to Idle when onSelectCard is called and no other card is selected', () => {
    const card: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: false
    };

    component.cards = [card];
    component.selectedCards = [card];

    component.onDeselectCard(card);

    expect(card.mode).toBe(<Mode>Mode.IdleMode);
  });

  it('should set selected card to IdleMode when whiteboard is clicked', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const card2: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cards = [card, card2];

    const whiteboard = fixture.debugElement.query(By.css('.whiteboard'));
    whiteboard.triggerEventHandler('click', new MouseEvent('click'));
    component.cards.forEach(c => expect(c.mode).toBe(Mode.IdleMode));
  });

  it('should save whiteboard when save button is clicked', () => {
    const workspace_card: CardInterface = {
      mode: Mode.IdleMode,
      description: 'First card',
      image: null,
      color: 'blue',
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const workspace_card_2: CardInterface = {
      mode: Mode.SelectedMode,
      description: 'Grieken en Romeinen',
      image: null,
      color: 'yellow',
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const shelved_card: CardInterface = {
      mode: Mode.ShelfMode,
      description: 'Second card',
      image: null,
      color: 'red',
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.title = 'test board';
    component.cards = [workspace_card, workspace_card_2];
    component.shelvedCards = [shelved_card];

    const savedBoard = component.saveWhiteboard();

    expect(savedBoard.title).toBe(component.title);
    expect(savedBoard.cards).toBe(component.cards);
    expect(savedBoard.shelfCards).toBe(component.shelvedCards);
  });

  it('should add card to shelf on delete when card was made by editorial office', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cards = [card];
    component.shelvedCards = [];
    component.onDeleteCard(card);

    expect(component.shelvedCards.length).toBe(1);
    expect(component.cards.length).toBe(0);
  });

  it('should update mode to ShelfMode on delete when card was made by editorial office', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.onDeleteCard(card);
    expect(card.mode).toBe(Mode.ShelfMode);
  });

  it('should not add a card if file type of dropped file is unsupported', () => {
    const cardsLengthBeforeAdd = component.cards.length;

    const file = new File([''], 'dummy.jpg', {
      type: ''
    });

    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file] },
      offsetX: 400,
      offsetY: 400
    };

    component.onFilesDropped(fileDropEvent);

    expect(component.cards.length).toBe(cardsLengthBeforeAdd);
  });

  it('should add a card to the whiteboard on image drag', () => {
    const cardsLengthBeforeAdd = component.cards.length;

    const mockFileReader = {
      result: '',
      readAsDataURL: blobInput => {},
      onloadend: () => {}
    };

    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake(blobInput => {
      mockFileReader.result = 'dummy.jpg';
      mockFileReader.onloadend();
    });

    const file = new File([''], 'dummy.jpg', {
      type: component.allowedFileTypes[0]
    });

    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file] },
      offsetX: 400,
      offsetY: 400
    };

    component.onFilesDropped(fileDropEvent);

    expect(component.cards.length).toBe(cardsLengthBeforeAdd + 1);
  });

  it('should add card to whiteboard on image drag with correct top value', () => {
    const mockFileReader = {
      result: '',
      readAsDataURL: blobInput => {},
      onloadend: () => {}
    };

    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake(blobInput => {
      mockFileReader.result = 'dummy.jpg';
      mockFileReader.onloadend();
    });

    const file = new File([''], 'dummy.jpg', {
      type: component.allowedFileTypes[0]
    });

    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file] },
      offsetX: 400,
      offsetY: 400
    };

    component.onFilesDropped(fileDropEvent);

    const addedCard = component.cards[component.cards.length - 1];

    expect(addedCard.top).toBe(400);
  });

  it('should add card to whiteboard on image drag with correct left value', () => {
    const mockFileReader = {
      result: '',
      readAsDataURL: blobInput => {},
      onloadend: () => {}
    };

    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake(blobInput => {
      mockFileReader.result = 'dummy.jpg';
      mockFileReader.onloadend();
    });

    const file = new File([''], 'dummy.jpg', {
      type: component.allowedFileTypes[0]
    });

    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file] },
      offsetX: 400,
      offsetY: 400
    };

    component.onFilesDropped(fileDropEvent);

    const addedCard = component.cards[component.cards.length - 1];

    expect(addedCard.left).toBe(400);
  });

  it('should add cards with correct offset on image drag', () => {
    const mockFileReader = {
      result: '',
      readAsDataURL: blobInput => {},
      onloadend: () => {}
    };

    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
    spyOn<any>(mockFileReader, 'readAsDataURL').and.callFake(blobInput => {
      mockFileReader.result = 'dummy.jpg';
      mockFileReader.onloadend();
    });

    const file = new File([''], 'dummy.jpg', {
      type: component.allowedFileTypes[0]
    });

    const fileDropEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: { files: [file, file] },
      offsetX: 400,
      offsetY: 400
    };

    component.onFilesDropped(fileDropEvent);

    const addedCard = component.cards[component.cards.length - 1];

    expect(addedCard.top).toBe(400 + component.multipleCardCreationOffset);
    expect(addedCard.left).toBe(400 + component.multipleCardCreationOffset);
  });
});

import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
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
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Mode } from '../../enums/mode.enum';
import CardInterface from '../../models/card.interface';
import { WhiteboardHttpService } from '../../services/whiteboard-http.service';
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
        },
        {
          provide: HttpClient,
          useValue: {
            get: () => of(),
            post: () => of()
          }
        },
        {
          provide: WhiteboardHttpService,
          useValue: {
            uploadFile: () => of('imageUrl').pipe(delay(500)),
            getJson: () => of(),
            setJson: () => of()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhiteboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const card1: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const card2: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cards = [card1, card2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a card on plus button clicked', () => {
    const cardsSizeBeforeClicked = component.cards.length;

    component.btnPlusClicked();

    expect(component.cards.length).toBe(cardsSizeBeforeClicked + 1);
  });

  it('should set card mode to ShelfMode when card is added to the shelf', () => {
    const [card] = component.cards;

    component.addCardToShelf(card);

    expect(card.mode).toBe(Mode.ShelfMode);
  });

  it('should add card to the shelvedCards when card is added to the shelf', () => {
    const [card] = component.cards;

    component.addCardToShelf(card);

    expect(component.shelvedCards).toContain(card);
  });

  it('should delete a card from the list of cards when the user clicks delete', () => {
    const cardSizeBeforeDelete = component.cards.length;
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardSizeBeforeDelete - 1);
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
    const [card] = component.cards;
    card.mode = <Mode>Mode.ZoomMode;

    component.onCardTapped(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should set card mode to ZoomMode on cardTapped starting from IdleMode if zoom mode is allowed', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    spyOn<any>(component, 'isZoomAllowedForCard').and.returnValue(true);

    component.onCardTapped(card);

    expect(card.mode).toBe(Mode.ZoomMode);
  });

  it('should not set card mode to ZoomMode on cardTapped starting from IdleMode if zoom mode is not allowed', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    spyOn<any>(component, 'isZoomAllowedForCard').and.returnValue(false);

    component.onCardTapped(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should set card mode to EditMode when cardEditIconClicked is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.cardEditIconClicked(card);

    expect(card.mode).toBe(Mode.EditMode);
  });

  it('should set card mode to IdleMode when cardConfirmIconClicked is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.cardConfirmIconClicked(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should toggle card viewModeImage when cardFlipIconClicked is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;
    card.viewModeImage = false;

    component.cardFlipIconClicked(card);

    expect(card.viewModeImage).toBe(true);
  });

  it('should set card mode to IdleMode when cardFlipIconClicked is called and card was not in EditMode', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.SelectedMode;

    component.cardFlipIconClicked(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should not set card mode to IdleMode when cardFlipIconClicked is called and card was in EditMode', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.EditMode;

    component.cardFlipIconClicked(card);

    expect(card.mode).toBe(Mode.EditMode);
  });

  it('should not change mode when onCardPressed is called and card was in ShelfMode', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.ShelfMode;

    component.onCardPressed(card);

    expect(card.mode).toBe(Mode.ShelfMode);
  });

  it('should change mode to IdleMode when onCardPressed is called and card was in SelectedMode', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.SelectedMode;

    component.onCardPressed(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should change mode to IdleMode when onCardPressed is called and card was in EditMode', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.EditMode;

    component.onCardPressed(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should change mode to SelectedMode when onCardPressed is called and card was not in ShelfMode, SelectedMode or EditMode', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.onCardPressed(card);

    expect(card.mode).toBe(Mode.SelectedMode);
  });

  it('should remove image from a card when removeImageFromCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.removeImageFromCard(card);

    expect(card.image).toBeFalsy();
  });

  it('should set card mode to UploadMode when updateImageFromCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    const file = new File([''], 'dummy.jpg', {
      type: ''
    });

    component.uploadImageForCard(card, file);

    expect(card.mode).toBe(Mode.UploadMode);
  });

  it('should set card image to url after upload', async(
    inject([WhiteboardHttpService], whiteboardHttpService => {
      whiteboardHttpService.uploadFile().subscribe(result => {
        const [card] = component.cards;
        card.mode = <Mode>Mode.IdleMode;

        const file = new File([''], 'dummy.jpg', {
          type: ''
        });

        component.uploadImageForCard(card, file);

        expect(card.image).toBe('imageUrl');
      });
    })
  ));

  it('should set color of card when changeColorForCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.changeColorForCard(card, 'black');

    expect(card.color).toBe('black');
  });

  it('should set lastColor of whiteboard when changeColorForCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

    component.changeColorForCard(card, 'black');

    expect(component.lastColor).toBe('black');
  });

  it('should set mode of card to IdleMode when changeColorForCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.SelectedMode;

    component.changeColorForCard(card, 'black');

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
    const [card1, card2] = component.cards;
    card1.mode = <Mode>Mode.MultiSelectSelectedMode;
    card2.mode = <Mode>Mode.MultiSelectSelectedMode;

    component.selectedCards = [card1, card2];

    component.bulkDeleteClicked();

    expect(component.selectedCards.length).toBe(0);
  });

  it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
    const [idleCard, selectedCard] = component.cards;
    idleCard.mode = <Mode>Mode.IdleMode;
    selectedCard.mode = <Mode>Mode.SelectedMode;

    component.onCardPressed(idleCard);

    expect(selectedCard.mode).toEqual(Mode.IdleMode);
  });

  it('should change the colors of the selected cards when a swatch is clicked', () => {
    const [card1, card2] = component.cards;
    card1.mode = <Mode>Mode.MultiSelectSelectedMode;
    card2.mode = <Mode>Mode.MultiSelectSelectedMode;

    component.selectedCards = [card1, card2];

    component.changeSelectedCardsColor('black');

    component.selectedCards.forEach(c => expect(c.color).toBe('black'));
  });

  it('should set card mode to MultiSelectSelectedMode when onSelectCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.SelectedMode;

    component.onSelectCard(card);

    expect(card.mode).toBe(Mode.MultiSelectSelectedMode);
  });

  it("should set all cards' mode to MultiSelectMode when onSelectCard is called", () => {
    const [card1, card2] = component.cards;
    card1.mode = <Mode>Mode.SelectedMode;
    card2.mode = <Mode>Mode.IdleMode;

    component.onSelectCard(card1);

    expect(card2.mode).toBe(Mode.MultiSelectMode);
  });

  it('should add card to selectedCards when onSelectCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.SelectedMode;

    component.onSelectCard(card);

    expect(component.selectedCards).toContain(card);
  });

  it('should remove card from selectedCards when onDeselectCard is called', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.MultiSelectSelectedMode;

    component.selectedCards = [card];

    component.onDeselectCard(card);

    expect(component.selectedCards).not.toContain(card);
  });

  it('should set card mode to MultiSelectMode when onDeselectCard is called and another card is still selected', () => {
    const [card1, card2] = component.cards;
    card1.mode = <Mode>Mode.MultiSelectSelectedMode;
    card2.mode = <Mode>Mode.MultiSelectSelectedMode;

    component.selectedCards = [card1, card2];

    component.onDeselectCard(card1);

    expect(card1.mode).toBe(Mode.MultiSelectMode);
  });

  it('should set card mode to Idle when onSelectCard is called and no other card is selected', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.MultiSelectSelectedMode;

    component.selectedCards = [card];

    component.onDeselectCard(card);

    expect(card.mode).toBe(Mode.IdleMode);
  });

  it('should set selected card to IdleMode when whiteboard is clicked', () => {
    const [idleCard, selectedCard] = component.cards;
    idleCard.mode = <Mode>Mode.IdleMode;
    selectedCard.mode = <Mode>Mode.SelectedMode;

    const whiteboard = fixture.debugElement.query(By.css('.whiteboard'));
    whiteboard.triggerEventHandler('click', new MouseEvent('click'));

    component.cards.forEach(c => expect(c.mode).toBe(Mode.IdleMode));
  });

  it('should save whiteboard when save button is clicked', () => {
    const [workspaceCard, shelvedCard] = component.cards;
    workspaceCard.mode = <Mode>Mode.IdleMode;
    shelvedCard.mode = <Mode>Mode.ShelfMode;

    component.title = 'test board';
    component.shelvedCards = [shelvedCard];

    const savedBoard = component.saveWhiteboard();

    expect(savedBoard.title).toBe(component.title);
    expect(savedBoard.cards).toBe(component.cards);
    expect(savedBoard.shelfCards).toBe(component.shelvedCards);
  });

  it('should add card to shelf on delete when card was made by editorial office', () => {
    const cardsLengthBeforeDelete = component.cards.length;
    const shelvedCardsLengthBeforeDelete = component.shelvedCards.length;

    const [card] = component.cards;
    card.mode = Mode.IdleMode;

    component.onDeleteCard(card);

    expect(component.shelvedCards.length).toBe(
      shelvedCardsLengthBeforeDelete + 1
    );
    expect(component.cards.length).toBe(cardsLengthBeforeDelete - 1);
  });

  it('should update mode to ShelfMode on delete when card was made by editorial office', () => {
    const [card] = component.cards;
    card.mode = <Mode>Mode.IdleMode;

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

  it('should call uploadImageForCard on image drag', () => {
    spyOn(component, 'uploadImageForCard');

    const cardsLengthBeforeAdd = component.cards.length;

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

    expect(component.uploadImageForCard).toHaveBeenCalledWith(addedCard, file);
  });

  it('should add card to whiteboard on image drag with correct top value', () => {
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

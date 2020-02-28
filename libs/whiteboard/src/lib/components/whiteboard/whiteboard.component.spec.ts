import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatProgressBarModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModeEnum } from '../../enums/mode.enum';
import { CardFixture } from '../../models/card.fixture';
import CardInterface from '../../models/card.interface';
import { WhiteboardFixture } from '../../models/whiteboard.fixture';
import {
  WhiteboardHttpService,
  WhiteboardHttpServiceInterface
} from '../../services/whiteboard-http.service';
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
  let httpService: WhiteboardHttpServiceInterface;

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
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },

        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
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
    httpService = TestBed.get(WhiteboardHttpService);

    const card1: CardInterface = {
      mode: ModeEnum.IDLE,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    const card2: CardInterface = {
      mode: ModeEnum.IDLE,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0,
      viewModeImage: true
    };

    component.cards = [card1, card2];

    fixture.detectChanges();
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

    expect(card.mode).toBe(ModeEnum.SHELF);
    expect(component.shelvedCards).toContain(card);
  });

  it('should delete a card from the list of cards when the user clicks delete', () => {
    const cardSizeBeforeDelete = component.cards.length;
    const [card] = component.cards;

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardSizeBeforeDelete - 1);
    expect(component.cards).not.toContain(card);
  });

  describe('showTitleInput()', () => {
    it('should set isTitleInputSelected to true', () => {
      component.isTitleInputSelected = false;

      component.showTitleInput();

      expect(component.isTitleInputSelected).toBe(true);
    });

    it('should set isTitleInputSelected to false if title is not empty', () => {
      component.isTitleInputSelected = true;
      component.title = 'test';

      component.hideTitleInput();

      expect(component.isTitleInputSelected).toBe(false);
    });

    it('should set isTitleInputSelected to true if title is empty', () => {
      component.isTitleInputSelected = true;
      component.title = '';

      component.hideTitleInput();

      expect(component.isTitleInputSelected).toBe(true);
    });
  });

  describe('onCardTapped()', () => {
    it('should set card mode to IdleMode if previous mode was ZoomMode', () => {
      const [card] = component.cards;
      card.mode = <ModeEnum>ModeEnum.ZOOM;

      component.onCardTapped(card);

      expect(card.mode).toBe(ModeEnum.IDLE);
    });

    it('should set card mode to ZoomMode starting from IdleMode if zoom mode is allowed', () => {
      const card = new CardFixture();

      component.onCardTapped(card);

      expect(card.mode).toBe(ModeEnum.ZOOM);
    });

    it('should not set card mode to ZoomMode starting from IdleMode if zoom mode is not allowed', () => {
      const card = new CardFixture({
        viewModeImage: false
      });
      component.onCardTapped(card);

      expect(card.mode).toBe(ModeEnum.IDLE);
    });
  });

  describe('card toolbar handlers', () => {
    it('should set card mode to EditMode when cardEditIconClicked is called', () => {
      const [card] = component.cards;
      card.mode = <ModeEnum>ModeEnum.IDLE;

      component.cardEditIconClicked(card);

      expect(card.mode).toBe(ModeEnum.EDIT);
    });

    it('should set card mode to IdleMode when cardConfirmIconClicked is called', () => {
      const [card] = component.cards;
      card.mode = <ModeEnum>ModeEnum.IDLE;

      component.cardConfirmIconClicked(card);

      expect(card.mode).toBe(ModeEnum.IDLE);
    });

    describe('cardFlipIconClicked()', () => {
      it('should toggle card viewModeImage', () => {
        const [card] = component.cards;
        card.mode = <ModeEnum>ModeEnum.IDLE;
        card.viewModeImage = false;

        component.cardFlipIconClicked(card);

        expect(card.viewModeImage).toBe(true);

        component.cardFlipIconClicked(card);
        expect(card.viewModeImage).toBe(false);
      });

      it('should set card mode to IdleMode if card.mode != edit', () => {
        const [card] = component.cards;
        card.mode = <ModeEnum>ModeEnum.SELECTED;

        const nonEditModes = Object.keys(ModeEnum).filter(
          key =>
            !isNaN(Number(ModeEnum[key])) && ModeEnum[key] !== ModeEnum.EDIT
        );

        nonEditModes.forEach(mode => {
          component.cardFlipIconClicked(card);

          expect(card.mode).toBe(ModeEnum.IDLE);
        });
      });

      it('should stay in EditMode if card.mode === edit', () => {
        const [card] = component.cards;
        card.mode = <ModeEnum>ModeEnum.EDIT;

        component.cardFlipIconClicked(card);

        expect(card.mode).toBe(ModeEnum.EDIT);
      });
    });
  });

  describe('onCardClicked()', () => {
    const mockMouseEvent = {
      stopPropagation: jest.fn()
    };

    const nonIdleModes = Object.keys(ModeEnum).filter(
      key => !isNaN(Number(ModeEnum[key])) && ModeEnum[key] !== ModeEnum.IDLE
    );

    beforeEach(() => {
      mockMouseEvent.stopPropagation.mockReset();
    });

    it('should not propagate click when mode != idle', () => {
      nonIdleModes.forEach(mode => {
        component.onCardClicked(
          mockMouseEvent as any,
          new CardFixture({ mode: ModeEnum[mode] })
        );
        expect(mockMouseEvent.stopPropagation).toHaveBeenCalled();
      });
    });
    it('should propagate click when mode === idle', () => {
      component.onCardClicked(
        mockMouseEvent as any,
        new CardFixture({ mode: ModeEnum.IDLE })
      );

      expect(mockMouseEvent.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('onCardPressed()', () => {
    it('should not change mode if card.mode = shelf', () => {
      const card = new CardFixture({ mode: ModeEnum.SHELF });

      component.onCardPressed(card);

      expect(card.mode).toBe(ModeEnum.SHELF);
    });

    it('should change mode to IdleMode if card.mode = select', () => {
      const card = new CardFixture({ mode: ModeEnum.SELECTED });

      component.onCardPressed(card);

      expect(card.mode).toBe(ModeEnum.IDLE);
    });

    it('should change mode to IdleMode if card.mode = EditMode', () => {
      const card = new CardFixture({ mode: ModeEnum.EDIT });

      component.onCardPressed(card);

      expect(card.mode).toBe(ModeEnum.IDLE);
    });

    it('should change mode to SelectedMode if card.mode != shelf, select or edit', () => {
      const modesForTesting = Object.keys(ModeEnum).filter(
        key =>
          !isNaN(Number(ModeEnum[key])) &&
          ModeEnum[key] !== ModeEnum.EDIT &&
          ModeEnum[key] !== ModeEnum.SHELF &&
          ModeEnum[key] !== ModeEnum.SELECTED
      );

      modesForTesting.forEach(mode => {
        const card = new CardFixture({ mode: ModeEnum[mode] });
        component.onCardPressed(card);

        expect(card.mode).toBe(ModeEnum.SELECTED);
      });
    });
  });

  xdescribe('updateImageForCard()', () => {
    // TODO: check upload flow
    it('should set card mode to UploadMode when ', () => {
      const card = new CardFixture();

      const file = new File([''], 'dummy.jpg', {
        type: ''
      });

      component.uploadImageForCard(card, file);

      expect(card.mode).toBe(ModeEnum.UPLOAD);
    });

    it('should set card image to url after upload', () => {
      const file = new File([''], 'dummy.jpg', {
        type: ''
      });
      httpService.uploadFile(file).subscribe(result => {
        const [card] = component.cards;
        card.mode = <ModeEnum>ModeEnum.IDLE;

        component.uploadImageForCard(card, file);

        expect(card.image).toBe('imageUrl');
      });
    });
  });

  describe('changeColorForCard', () => {
    it('should set color of card', () => {
      const card = new CardFixture();

      component.changeColorForCard(card, 'black');

      expect(card.color).toBe('black');
    });

    it('should set lastColor of whiteboard', () => {
      const card = new CardFixture();

      component.changeColorForCard(card, 'black');

      expect(component.lastColor).toBe('black');
    });

    it('should set mode of card to IdleMode', () => {
      const card = new CardFixture({ mode: ModeEnum.SELECTED });

      component.changeColorForCard(card, 'black');

      expect(card.mode).toBe(ModeEnum.IDLE);
    });
  });

  describe('bulkActions', () => {
    const selectedCards = [
      new CardFixture({ mode: ModeEnum.MULTISELECTSELECTED }),
      new CardFixture({ mode: ModeEnum.MULTISELECTSELECTED })
    ];

    const nonSelectedCards = [
      new CardFixture({ mode: ModeEnum.IDLE }),
      new CardFixture({ mode: ModeEnum.IDLE })
    ];
    beforeEach(() => {
      component.cards = [...selectedCards, ...nonSelectedCards];
      component.selectedCards = selectedCards;
    });

    it('bulkDelete() should delete multiple cards', () => {
      component.shelvedCards = [];

      component.bulkDeleteClicked();

      expect(component.selectedCards.length).toBe(0);
      expect(component.cards).toEqual(nonSelectedCards);
      expect(component.shelvedCards).toEqual(selectedCards);
    });

    it('changeSelectedCardsColor() should change the colors of the selected cards when a swatch is clicked', () => {
      component.changeSelectedCardsColor('black');

      component.selectedCards.forEach(c => expect(c.color).toBe('black'));
      nonSelectedCards.forEach(c => expect(c.color).toBe('foo color'));
    });
  });

  describe('transition to selected mode', () => {
    it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
      const idleCard = new CardFixture({ mode: ModeEnum.IDLE });
      const selectedCard = new CardFixture({ mode: ModeEnum.SELECTED });
      component.cards = [idleCard, selectedCard];

      component.onCardPressed(idleCard);
      expect(selectedCard.mode).toEqual(ModeEnum.IDLE);
      expect(idleCard.mode).toEqual(ModeEnum.SELECTED);
    });
  });

  describe('onSelectCard()', () => {
    it('should set card mode to MultiSelectSelectedMode', () => {
      component.selectedCards = [];
      const card = new CardFixture({ mode: ModeEnum.SELECTED });
      component.onSelectCard(card);

      expect(component.selectedCards.length).toBe(1);
      expect(card.mode).toBe(ModeEnum.MULTISELECTSELECTED);
    });

    it("should set all cards' mode to MultiSelectMode", () => {
      component.cards = [
        new CardFixture({ mode: ModeEnum.SELECTED }),
        new CardFixture({ mode: ModeEnum.IDLE })
      ];

      component.onSelectCard(component.cards[0]);

      expect(component.cards[1].mode).toBe(ModeEnum.MULTISELECT);
    });

    it('should add card to selectedCards when onSelectCard is called', () => {
      const card = new CardFixture({ mode: ModeEnum.SELECTED });

      component.onSelectCard(card);

      expect(component.selectedCards).toContain(card);
    });
  });

  describe('onDeselectCard()', () => {
    it('should remove card from selectedCards when onDeselectCard is called', () => {
      const card = new CardFixture({ mode: ModeEnum.MULTISELECTSELECTED });

      component.selectedCards = [card];

      component.onDeselectCard(card);

      expect(component.selectedCards).not.toContain(card);
    });

    it('should set card mode to MultiSelectMode when onDeselectCard is called and another card is still selected', () => {
      const [card1, card2] = component.cards;
      card1.mode = <ModeEnum>ModeEnum.MULTISELECTSELECTED;
      card2.mode = <ModeEnum>ModeEnum.MULTISELECTSELECTED;

      component.selectedCards = [card1, card2];

      component.onDeselectCard(card1);

      expect(component.selectedCards.length).toBe(1);
      expect(card1.mode).toBe(ModeEnum.MULTISELECT);
      expect(card2.mode).toBe(ModeEnum.MULTISELECTSELECTED);
    });

    it('should set card mode to Idle when onDeselectCard is called and no other card is selected', () => {
      const [card] = component.cards;
      card.mode = <ModeEnum>ModeEnum.MULTISELECTSELECTED;

      component.selectedCards = [card];

      component.onDeselectCard(card);

      expect(card.mode).toBe(ModeEnum.IDLE);
    });
  });

  it('should set selected card to IdleMode when whiteboard is clicked', () => {
    const [idleCard, selectedCard] = component.cards;
    idleCard.mode = <ModeEnum>ModeEnum.IDLE;
    selectedCard.mode = <ModeEnum>ModeEnum.SELECTED;
    component.selectedCards = [selectedCard];

    const whiteboard = fixture.debugElement.query(By.css('.whiteboard'));
    whiteboard.triggerEventHandler('click', new MouseEvent('click'));

    expect(component.selectedCards.length).toBe(0);
    component.cards.forEach(c => expect(c.mode).toBe(ModeEnum.IDLE));
  });

  it('should save whiteboard when save button is clicked', () => {
    const setJsonSpy = jest.spyOn(httpService, 'setJson');

    const [workspaceCard, shelvedCard] = component.cards;
    workspaceCard.mode = <ModeEnum>ModeEnum.IDLE;
    shelvedCard.mode = <ModeEnum>ModeEnum.SHELF;

    component.title = 'test board';
    component.shelvedCards = [shelvedCard];

    component.saveWhiteboard();
    const expected = new WhiteboardFixture({
      title: 'test board',
      cards: component.cards,
      shelfCards: component.shelvedCards
    });

    expect(setJsonSpy).toHaveBeenCalledWith(expected);
  });

  describe('addEmptyCard()', () => {
    it('should add an empty card', () => {
      component.lastColor = 'red';
      component.cards = [];
      component.addEmptyCard(0, 0, 'www.si.be');
      expect(component.cards[0]).toEqual({
        mode: ModeEnum.IDLE,
        color: 'red',
        description: '',
        image: 'www.si.be',
        top: 0,
        left: 0,
        viewModeImage: true
      });
    });
  });

  describe('onDeleteCard()', () => {
    it('should add card to shelf  when card was made by editorial office', () => {
      component.shelvedCards = [];
      const [card] = component.cards;
      card.mode = ModeEnum.IDLE;

      component.onDeleteCard(card);

      expect(component.shelvedCards).toContain(card);
      expect(component.cards).not.toContain(card);
    });

    it('should update mode to ShelfMode when card was made by editorial office', () => {
      const [card] = component.cards;
      card.mode = <ModeEnum>ModeEnum.IDLE;

      component.onDeleteCard(card);

      expect(card.mode).toBe(ModeEnum.SHELF);
    });
  });

  describe('onFilesDropped()', () => {
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
      const addEmptySpy = jest
        .spyOn(component, 'addEmptyCard')
        .mockReturnValue(new CardFixture());
      const uploadImageForCardSpy = jest
        .spyOn(component, 'uploadImageForCard')
        .mockImplementation(() => {});

      const file = new File([''], 'dummy.jpg', {
        type: component.allowedFileTypes[0]
      });
      const file2 = new File([''], 'dummy.jpg', {
        type: component.allowedFileTypes[0]
      });

      const fileDropEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: { files: [file, file2] },
        offsetX: 400,
        offsetY: 400
      };

      component.onFilesDropped(fileDropEvent);

      expect(addEmptySpy).toHaveBeenCalledTimes(2);
      expect(uploadImageForCardSpy).toHaveBeenCalledTimes(2);
      expect(addEmptySpy.mock.calls).toEqual([
        [400, 400],
        [450, 450]
      ]);
      expect(uploadImageForCardSpy.mock.calls[0][0]).toEqual(new CardFixture());
      expect(uploadImageForCardSpy.mock.calls).toEqual([
        [new CardFixture(), file],
        [new CardFixture(), file2]
      ]);
    });
  });
});

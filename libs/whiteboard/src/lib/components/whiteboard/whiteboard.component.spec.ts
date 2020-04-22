import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { v4 as uuidv4 } from 'uuid';
import { CardTypeEnum } from '../../enums/cardType.enum';
import { ModeEnum } from '../../enums/mode.enum';
import { CardInterface } from '../../models/card.interface';
import { SettingsInterface } from '../../models/settings.interface';
import { WhiteboardModule } from '../../whiteboard.module';
import { CardFixture } from './../../models/card.fixture';
import { WhiteboardComponent } from './whiteboard.component';
describe('WhiteboardComponent', () => {
  let component: WhiteboardComponent;
  let fixture: ComponentFixture<WhiteboardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, WhiteboardModule],
      declarations: [],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
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

    component.title = '';
    component.cards = [new CardFixture(), new CardFixture()];
    component.shelfCards = [];
    component.canManage = true;

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
    expect(component.shelfCards).toContain(card);
  });

  it('should return card to shelf when the user clicks returncardtoshelf', () => {
    const cardSizeBeforeDelete = component.cards.length;
    const [card] = component.cards;
    component.addCardToShelf(card);
    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardSizeBeforeDelete - 1);
    expect(component.cards).not.toContain(card);
    expect(component.shelfCards.map(sc => sc.id)).toContain(card.id);
  });

  describe('updateCard()', () => {
    it('should update the card', () => {
      const card = new CardFixture({ description: 'foo' });
      component.updateCard({ description: 'bar' }, card);

      expect(card.description).toEqual('bar');
    });

    it('should sync updates with the shelf card', () => {
      const card = new CardFixture({ description: 'foo' });
      component.shelfCards = [card];

      component.updateCard({ description: 'bar' }, card);

      expect(component.shelfCards[0].description).toEqual('bar');
    });
  });

  describe('updateSettings()', () => {
    const updatedTitle = 'updatedTitle';
    const updatedDefaultColor = '#00000000';

    beforeEach(() => {
      jest.spyOn(component.changes, 'emit');
      jest.spyOn(component, 'toggleSettings');

      component.title = 'beforeTitle';
      component.defaultColor = '#FFFFFFFF';

      const settings: SettingsInterface = {
        title: updatedTitle,
        defaultColor: updatedDefaultColor
      };

      component.updateSettings(settings);
    });

    it('should update whiteboard title, defaultColor and lastColor', () => {
      expect(component.title).toBe(updatedTitle);
      expect(component.defaultColor).toBe('#00000000');
      expect(component.lastColor).toBe(updatedDefaultColor);
    });

    it('should save the whiteboard', () => {
      expect(component.changes.emit).toHaveBeenCalled();
      expect(component.changes.emit).toHaveBeenCalledWith({
        title: updatedTitle,
        defaultColor: updatedDefaultColor,
        cards: component.cards,
        shelfCards: component.shelfCards
      });
    });

    it('should change the color of every card to the chosen default color', () => {
      const defaultColor = 'beepboop';
      component.cards = [
        new CardFixture({ color: 'foo color' }),
        new CardFixture({ color: 'bar color' })
      ];
      component.shelfCards = [
        new CardFixture({ color: 'baz color' }),
        new CardFixture({ color: 'bob color' })
      ];

      const settings: SettingsInterface = {
        title: '',
        defaultColor: defaultColor
      };

      component.updateSettings(settings);

      expect(
        [...component.shelfCards, ...component.cards].every(
          card => card.color === defaultColor
        )
      ).toBe(true);
    });

    it('should toggle settings visibility', () => {
      component.isSettingsActive = true;

      const settings: SettingsInterface = {
        title: updatedTitle,
        defaultColor: updatedDefaultColor
      };

      component.updateSettings(settings);
      expect(component.isSettingsActive).toBe(false);

      component.updateSettings(settings);
      expect(component.isSettingsActive).toBe(true);

      expect(component.toggleSettings).toHaveBeenCalled();
    });
  });

  describe('canManage - template', () => {
    beforeEach(() => {
      // one card in the workspace
      component.cards = [new CardFixture({ mode: ModeEnum.EDIT })];
      fixture.detectChanges();
    });

    describe('canManage = true', () => {
      beforeEach(() => {
        component.canManage = true;
        fixture.detectChanges();
      });

      it('should hide card-colorlist when canMange is true', () => {
        const colorlist = fixture.debugElement.query(
          By.css('.whiteboard__color-list')
        );
        expect(colorlist).toBeFalsy();
      });

      it('should show settingsbutton when canMange is true', () => {
        const settingsbutton = fixture.debugElement.query(
          By.css('.whiteboard__workspace__actions__settingsbutton')
        );
        expect(settingsbutton).toBeTruthy();
      });
    });

    describe('canManage = false', () => {
      beforeEach(() => {
        component.canManage = false;
        fixture.detectChanges();
      });

      it('should show card-colorlist when canMange is false', () => {
        const colorlist = fixture.debugElement.query(
          By.css('.whiteboard__color-list')
        );
        expect(colorlist).toBeTruthy();
      });

      it('should hide settingsbutton when canMange is false', () => {
        const settingsbutton = fixture.debugElement.query(
          By.css('.whiteboard__workspace__actions__settingsbutton')
        );
        expect(settingsbutton).toBeFalsy();
      });
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
      it('should toggle viewModeImage', () => {
        const [card] = component.cards;
        card.description = 'tekst';
        card.image = { imageUrl: 'imageUrl' };
        card.viewModeImage = false;

        component.cardFlipIconClicked(card);
        expect(card.viewModeImage).toBe(true);

        component.cardFlipIconClicked(card);
        expect(card.viewModeImage).toBe(false);
      });

      it('should not change viewMode when there is no image', () => {
        const [card] = component.cards;
        card.description = 'tekst';
        card.image = null;
        card.viewModeImage = false;

        component.cardFlipIconClicked(card);
        expect(card.viewModeImage).toBe(false);
      });

      it('should not change viewMode when there is no text', () => {
        const [card] = component.cards;
        card.description = '';
        card.image = { imageUrl: 'imageUrl' };
        card.viewModeImage = true;

        component.cardFlipIconClicked(card);
        expect(card.viewModeImage).toBe(true);
      });

      it('should set card mode to IdleMode if card.mode !== edit', () => {
        const [card] = component.cards;
        card.mode = <ModeEnum>ModeEnum.SELECTED;
        card.description = 'tekst';
        card.image = { imageUrl: 'imageUrl' };

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

    describe('onCardPressed()', () => {
      it('should not change mode if card.mode = shelf', () => {
        const card = new CardFixture({
          mode: ModeEnum.SHELF
        });

        component.onCardPressed(card);

        expect(card.mode).toBe(ModeEnum.SHELF);
      });

      it('should change mode to IdleMode if card.mode = select', () => {
        const card = new CardFixture({
          mode: ModeEnum.SELECTED
        });

        component.onCardPressed(card);

        expect(card.mode).toBe(ModeEnum.IDLE);
      });

      it('should change mode to IdleMode if card.mode = EditMode', () => {
        const card = new CardFixture({
          mode: ModeEnum.EDIT
        });

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
          const card = new CardFixture({
            mode: ModeEnum[mode]
          });
          component.onCardPressed(card);

          expect(card.mode).toBe(ModeEnum.SELECTED);
        });
      });
    });

    describe('onFilePickerImageSelected()', () => {
      const card = new CardFixture();
      const file = new File([''], 'dummy.jpg', {
        type: 'image/jpeg'
      });
      let emitSpy: jest.SpyInstance;

      const imagePickedEvent: any = {
        target: {
          files: [file]
        }
      };

      beforeEach(() => {
        emitSpy = jest.spyOn(component.uploadImage, 'next');
        component.onFilePickerImageSelected(imagePickedEvent, card);
      });

      it('should set card mode to UploadMode', () => {
        expect(card.mode).toBe(ModeEnum.UPLOAD);
      });

      it('should trigger an uploadImage event', () => {
        expect(emitSpy).toHaveBeenCalledTimes(1);
        expect(emitSpy).toHaveBeenCalledWith({ card, imageFile: file });
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
        const card = new CardFixture({
          mode: ModeEnum.SELECTED
        });

        component.changeColorForCard(card, 'black');

        expect(card.mode).toBe(ModeEnum.IDLE);
      });

      it('should should update color of shelfcard copy', () => {
        component.canManage = true;

        component.lastColor = 'red';
        component.cards = [];
        component.shelfCards = [];
        component.addEmptyCard();

        component.changeColorForCard(component.cards[0], 'black');

        expect(component.cards[0].color).toEqual(component.shelfCards[0].color);
      });
    });

    describe('bulkActions', () => {
      const selectedCards = [
        new CardFixture({
          id: '1',
          type: CardTypeEnum.PUBLISHER,
          mode: ModeEnum.MULTISELECTSELECTED
        }),
        new CardFixture({
          id: '2',
          type: CardTypeEnum.TEACHER,
          mode: ModeEnum.MULTISELECTSELECTED
        }),
        new CardFixture({
          id: '3',
          type: CardTypeEnum.TEACHER,
          mode: ModeEnum.MULTISELECTSELECTED
        })
      ];

      const nonSelectedCards = [
        new CardFixture({
          id: '4',
          mode: ModeEnum.MULTISELECT
        }),
        new CardFixture({
          id: '5',
          mode: ModeEnum.MULTISELECT
        })
      ];
      beforeEach(() => {
        component.cards = [...selectedCards, ...nonSelectedCards];
        component.selectedCards = selectedCards;
      });

      it('bulkDelete() should delete multiple cards', () => {
        jest.spyOn(component, 'onDeleteCard');

        component.bulkDeleteClicked();

        expect(nonSelectedCards.every(c => c.mode === ModeEnum.IDLE)).toBe(
          true
        );

        expect(component.onDeleteCard).toHaveBeenCalledTimes(
          selectedCards.length
        );

        selectedCards.forEach(card =>
          expect(component.onDeleteCard).toHaveBeenCalledWith(card, true)
        );

        expect(component.selectedCards).toStrictEqual([]);
      });

      it('bulkReturnCardsToShelfClicked() should only return publisher cards to shelf', () => {
        jest.spyOn(component, 'updateWhiteboard');

        component.bulkReturnCardsToShelfClicked();

        expect(nonSelectedCards.every(c => c.mode === ModeEnum.IDLE)).toBe(
          true
        );

        expect(component.updateWhiteboard).toHaveBeenCalledWith({
          cards: [
            ...nonSelectedCards,
            { ...selectedCards[1], mode: ModeEnum.IDLE }, // teacher card
            { ...selectedCards[2], mode: ModeEnum.IDLE } // teacher card
          ]
        });

        expect(component.selectedCards).toStrictEqual([]);
      });

      it('changeSelectedCardsColor() should change the colors of the selected cards when a swatch is clicked', () => {
        component.changeSelectedCardsColor('black');

        component.selectedCards.forEach(c => expect(c.color).toBe('black'));
        nonSelectedCards.forEach(c => expect(c.color).toBe('foo color'));
      });
    });

    describe('transition to selected mode', () => {
      it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
        const idleCard = new CardFixture({
          mode: ModeEnum.IDLE,
          id: uuidv4()
        });
        const selectedCard = new CardFixture({
          mode: ModeEnum.SELECTED,
          id: uuidv4()
        });
        component.cards = [idleCard, selectedCard];

        component.onCardPressed(idleCard);
        expect(selectedCard.mode).toEqual(ModeEnum.IDLE);
        expect(idleCard.mode).toEqual(ModeEnum.SELECTED);
      });
    });

    describe('onSelectCard()', () => {
      it('should set card mode to MultiSelectSelectedMode', () => {
        component.selectedCards = [];
        const card = new CardFixture({
          mode: ModeEnum.SELECTED
        });
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
        const card = new CardFixture({
          mode: ModeEnum.SELECTED
        });

        component.onSelectCard(card);

        expect(component.selectedCards).toContain(card);
      });
    });

    describe('onDeselectCard()', () => {
      it('should remove card from selectedCards when onDeselectCard is called', () => {
        const card = new CardFixture({
          mode: ModeEnum.MULTISELECTSELECTED
        });

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
      const touchEvent = new TouchEvent('tap');
      Object.defineProperty(touchEvent, 'target', {
        value: {
          classList: {
            contains: item => ['whiteboard__workspace'].includes(item)
          }
        }
      });

      whiteboard.triggerEventHandler('tap', touchEvent);

      expect(component.selectedCards.length).toBe(0);
      component.cards.forEach(c => expect(c.mode).toBe(ModeEnum.IDLE));
    });
  });

  describe('addEmptyCard()', () => {
    describe('publisher card - canManage = true', () => {
      beforeEach(() => {
        jest.spyOn(component.changes, 'emit');

        component.canManage = true;
        component.lastColor = 'red';
        component.cards = [];
        component.shelfCards = [];

        component.addEmptyCard();
      });
      it('should add an empty publisher card to the shelf and workspace', () => {
        const expectedCard = {
          id: component.cards[0].id,
          mode: ModeEnum.EDIT,
          type: CardTypeEnum.PUBLISHER,
          color: 'red',
          description: '',
          image: null,
          top: 0,
          left: 0,
          viewModeImage: false
        };

        expect(component.cards[0]).toEqual(expectedCard);

        expect(component.shelfCards[0]).toEqual({
          ...expectedCard,
          mode: ModeEnum.SHELF
        });
      });

      it('should emit changes', () => {
        expect(component.changes.emit).toHaveBeenCalledTimes(2);
      });
    });
    describe('teacher card - canManage = false', () => {
      beforeEach(() => {
        jest.spyOn(component.changes, 'emit');
        component.canManage = false;
        component.lastColor = 'red';
        component.cards = [];
        component.shelfCards = [];

        component.addEmptyCard();
      });
      it('should add an empty teacher card to the workspace', () => {
        expect(component.cards[0]).toEqual({
          id: component.cards[0].id,
          mode: ModeEnum.EDIT,
          type: CardTypeEnum.TEACHER,
          color: 'red',
          description: '',
          image: null,
          top: 0,
          left: 0,
          viewModeImage: false
        });

        expect(component.shelfCards.length).toBe(0);
      });
      it('should emit changes', () => {
        expect(component.changes.emit).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('onDeleteCard()', () => {
    let cardToBeDeleted: CardInterface;
    let numberOfWorkspaceCardsBeforeDelete: number;
    let numberOfShelfCardsBeforeDelete: number;

    beforeEach(() => {
      // test setup:
      // workspace: 2 cards
      // shelf: 2 cards
      cardToBeDeleted = new CardFixture(
        new CardFixture({ id: 'I should be permantently deleted' })
      );
      component.shelfCards = [
        cardToBeDeleted,
        new CardFixture({ id: 'don not delete me plz' })
      ];

      component.cards = [
        cardToBeDeleted,
        new CardFixture({ id: 'do not delete me either plz' })
      ];

      numberOfWorkspaceCardsBeforeDelete = component.cards.length;
      numberOfShelfCardsBeforeDelete = component.shelfCards.length;

      jest.spyOn(component.changes, 'emit');
    });

    it('should only remove the card from the workspace - permanent = falsy', () => {
      component.onDeleteCard(cardToBeDeleted);

      const numberOfWorkspaceCardsAfterDelete = component.cards.length;

      expect(numberOfWorkspaceCardsAfterDelete).toBe(
        numberOfWorkspaceCardsBeforeDelete - 1
      );
      expect(component.shelfCards.map(sc => sc.id)).toContain(
        cardToBeDeleted.id
      );
      expect(component.cards).not.toContain(cardToBeDeleted);

      expect(component.changes.emit).toHaveBeenCalled();
      expect(component.changes.emit).toHaveBeenCalledWith({
        title: component.title,
        defaultColor: component.defaultColor,
        cards: [new CardFixture({ id: 'do not delete me either plz' })],
        shelfCards: [
          cardToBeDeleted,
          new CardFixture({ id: 'don not delete me plz' })
        ]
      });
    });

    it('should remove the card from the workspace and shelf - permanent = true', () => {
      component.onDeleteCard(cardToBeDeleted, true);

      expect(component.cards.length).toBe(
        numberOfWorkspaceCardsBeforeDelete - 1
      );
      expect(component.cards).not.toContain(cardToBeDeleted);
      expect(component.shelfCards.map(sc => sc.id)).not.toContain(
        cardToBeDeleted.id
      );

      expect(component.changes.emit).toHaveBeenCalled();
      expect(component.changes.emit).toHaveBeenCalledWith({
        title: component.title,
        defaultColor: component.defaultColor,
        cards: [new CardFixture({ id: 'do not delete me either plz' })],
        shelfCards: [new CardFixture({ id: 'don not delete me plz' })]
      });
    });

    it('should not remove the card from the shelf - permanent = true, canManage = false, card type = teacher', () => {
      component.canManage = false;
      cardToBeDeleted.type = CardTypeEnum.PUBLISHER;

      component.onDeleteCard(cardToBeDeleted, true);

      expect(component.cards.length).toBe(
        numberOfWorkspaceCardsBeforeDelete - 1
      );
      expect(component.cards).not.toContain(cardToBeDeleted);
      expect(component.shelfCards.map(sc => sc.id)).toContain(
        cardToBeDeleted.id
      );

      expect(component.changes.emit).toHaveBeenCalled();
      expect(component.changes.emit).toHaveBeenCalledWith({
        title: component.title,
        defaultColor: component.defaultColor,
        cards: [new CardFixture({ id: 'do not delete me either plz' })],
        shelfCards: [
          cardToBeDeleted,
          new CardFixture({ id: 'don not delete me plz' })
        ]
      });
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
      const emitSpy = jest
        .spyOn(component.uploadImage, 'next')
        .mockImplementation(() => {});

      const file1 = new File([''], 'dummy1.jpg', {
        type: component.allowedFileTypes[0]
      });
      const file2 = new File([''], 'dummy2.jpg', {
        type: component.allowedFileTypes[0]
      });

      const fileDropEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: { files: [file1, file2] },
        offsetX: 400,
        offsetY: 400
      };

      component.onFilesDropped(fileDropEvent);

      expect(addEmptySpy).toHaveBeenCalledTimes(2);
      expect(addEmptySpy.mock.calls).toEqual([
        [{ top: 400, left: 400 }],
        [{ top: 450, left: 450 }]
      ]);

      expect(emitSpy).toHaveBeenCalledTimes(2);
      [file1, file2].forEach(file =>
        expect(emitSpy).toHaveBeenCalledWith({
          card: new CardFixture({ mode: ModeEnum.UPLOAD }),
          imageFile: file
        })
      );
    });
  });

  describe('whiteboard toolbar handlers', () => {
    describe('zoom button', () => {
      beforeEach(() => {
        component.zoomFactor = 1;
      });

      it('increaseZoom() should zoom in', () => {
        const expectedTicks = [1.2, 1.4, 1.6, 1.8, 2, 2];

        for (let i = 0; i < expectedTicks.length; i++) {
          component.increaseZoom();

          expect(component.zoomFactor).toBe(expectedTicks[i]);
        }
      });

      it('decreaseZoom() should zoom out', () => {
        const expectedTicks = [0.8, 0.6, 0.4, 0.4];

        for (let i = 0; i < expectedTicks.length; i++) {
          component.decreaseZoom();

          expect(component.zoomFactor).toBe(expectedTicks[i]);
        }
      });
    });
  });

  describe('file upload response', () => {
    // The first part of upload files, picking/dragging files has been tested in the event handlers
    // Those tests assert that the correct event has been emitted
    // These tests are about handling the response of the service via input

    const fileUploadResponse = (card, progress?, imageUrl?) => {
      const response = {
        card,
        image: { progress, imageUrl }
      };

      const uploadImageResponse = {
        currentValue: response,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false
      } as SimpleChange;

      component.ngOnChanges({ uploadImageResponse });
    };

    let mockCard: CardInterface;
    beforeEach(() => {
      mockCard = new CardFixture({ mode: ModeEnum.UPLOAD });
      component.cards = [mockCard];
    });

    describe('progress', () => {
      beforeEach(() => {
        component.changes.emit = jest.fn();
        fileUploadResponse(mockCard, 15);
      });

      it('should show the upload progress', () => {
        expect(mockCard.image.progress).toBe(15);
        expect(mockCard.mode).toBe(ModeEnum.UPLOAD);
      });

      it('should not emit a whiteboard change', () => {
        expect(component.changes.emit).not.toHaveBeenCalled();
      });
    });

    describe('upload finished', () => {
      beforeEach(() => {
        component.changes.emit = jest.fn();
        fileUploadResponse(mockCard, undefined, 'some.image.url');
      });

      it('should show the image', () => {
        expect(mockCard.image.imageUrl).toBe('some.image.url');
        expect(mockCard.mode).toBe(ModeEnum.IDLE);
        expect(mockCard.viewModeImage).toBe(true);
      });

      it('should emit a whiteboard change', () => {
        const expected = jasmine.objectContaining({ cards: [mockCard] });

        expect(component.changes.emit).toHaveBeenCalledWith(expected);
      });

      it('should reset the selection', () => {
        component.selectedCards = [mockCard];

        fileUploadResponse(mockCard, undefined, 'some.image.url');

        expect(mockCard.mode).toBe(ModeEnum.MULTISELECT);
        expect(mockCard.viewModeImage).toBe(true);
      });
    });
  });
});

import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
        DragDropModule,
        HttpClientModule
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
            get: () => {},
            patch: () => {},
            post: () => {}
          }
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

  it('should delete a card from the list of cards when the user clicks delete', () => {
    const cardsSizeBeforeAdding = component.cards.length;

    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    component.cards.push(card);

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardsSizeBeforeAdding);
  });

  it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
    const card1: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    const card2: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    component.cards = [card1, card2];

    component.bulkDeleteClicked();

    expect(component.cards.length).toBe(0);
  });

  it('should set other cards to IdleMode when a card mode changes to SelectedMode', () => {
    const idleCard: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    const selectedCard: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    component.cards = [idleCard, selectedCard];

    component.cardModeChanged(idleCard, Mode.SelectedMode);

    expect(selectedCard.mode).toEqual(Mode.IdleMode);
  });

  it('should change the colors of the selected cards when a swatch is clicked', () => {
    const card: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    const card2: CardInterface = {
      mode: Mode.MultiSelectSelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };

    component.cards = [card, card2];

    component.changeSelectedCardsColor('black');

    component.cards.forEach(c => expect(c.color).toBe('black'));
  });

  it('should set selected card to IdleMode when whiteboard is clicked', () => {
    const card: CardInterface = {
      mode: Mode.IdleMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
    };
    const card2: CardInterface = {
      mode: Mode.SelectedMode,
      description: '',
      image: null,
      color: null,
      top: 0,
      left: 0
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
      left: 0
    };
    const workspace_card_2: CardInterface = {
      mode: Mode.SelectedMode,
      description: 'Grieken en Romeinen',
      image: null,
      color: 'yellow',
      top: 0,
      left: 0
    };
    const shelved_card: CardInterface = {
      mode: Mode.ShelfMode,
      description: 'Second card',
      image: null,
      color: 'red',
      top: 0,
      left: 0
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
      left: 0
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
      left: 0
    };
    component.onDeleteCard(card);
    expect(card.mode).toBe(Mode.ShelfMode);
  });
});

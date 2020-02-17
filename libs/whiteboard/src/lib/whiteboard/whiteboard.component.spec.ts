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
import { HAMMER_LOADER } from '@angular/platform-browser';
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
});

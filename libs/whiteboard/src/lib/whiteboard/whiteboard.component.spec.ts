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
import Card from '../../interfaces/card.interface';
import { CardImageComponent } from '../card-image/card-image.component';
import { CardTextComponent } from '../card-text/card-text.component';
import { CardComponent } from '../card/card.component';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ShelfComponent } from '../shelf/shelf.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WhiteboardToolsComponent } from '../whiteboard-tools/whiteboard-tools.component';
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
        MatInputModule
      ],
      declarations: [
        WhiteboardComponent,
        CardComponent,
        ToolbarComponent,
        ColorlistComponent,
        WhiteboardToolsComponent,
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

    const card = {
      description: '',
      image: null,
      color: null,
      editMode: true,
      top: 0,
      left: 0,
      toolbarsVisible: false
    };

    component.cards.push(card);

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardsSizeBeforeAdding);
  });

  it('should add a card when checkbox is selected', () => {
    const card: Card = {
      description: '',
      image: null,
      color: null,
      editMode: true,
      top: 0,
      left: 0,
      toolbarsVisible: false
    };
    component.cards = [card];
    component.selectedCards = [];

    component.selectCard(card);

    expect(component.selectedCards).toContain(card);
  });

  it('should remove a card when checkbox is selected again', () => {
    const card: Card = {
      description: '',
      image: null,
      color: null,
      editMode: true,
      top: 0,
      left: 0,
      toolbarsVisible: false
    };
    component.cards = [card];
    component.selectedCards = [card];

    component.deselectCard(card);

    expect(component.selectedCards).not.toContain(card);
  });

  it('should change the colors of the selected cards when a swatch is clicked', () => {
    const card = {
      description: '',
      image: null,
      color: null,
      editMode: true,
      top: 0,
      left: 0,
      toolbarsVisible: false
    };

    const card2 = {
      description: '',
      image: null,
      color: null,
      editMode: true,
      top: 0,
      left: 0,
      toolbarsVisible: false
    };

    const cards = [card, card2];
    component.selectedCards = [card, card2];
    component.changeSelectedCardsColor('black');
    cards.forEach(c => expect(c.color).toBe('black'));
  });

  it('should remove a card from selectedCards when the card is selected and deleted', () => {
    const card = {
      description: '',
      image: null,
      color: null,
      editMode: true,
      top: 0,
      left: 0,
      toolbarsVisible: false
    };

    component.selectedCards = [card];

    component.onDeleteCard(card);

    expect(component.selectedCards.length).toBe(0);
  });
});

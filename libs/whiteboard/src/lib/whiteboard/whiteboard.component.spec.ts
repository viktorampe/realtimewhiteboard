import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatIconModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationModalComponent } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import Card from '../../interfaces/card.interface';
import { CardComponent } from '../card/card.component';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WhiteboardToolsComponent } from '../whiteboard-tools/whiteboard-tools.component';
import { WhiteboardComponent } from './whiteboard.component';

describe('WhiteboardComponent', () => {
  let component: WhiteboardComponent;
  let fixture: ComponentFixture<WhiteboardComponent>;

  let openDialogSpy: jest.SpyInstance;
  let matDialog: MatDialog;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [
        WhiteboardComponent,
        CardComponent,
        ToolbarComponent,
        ColorlistComponent,
        WhiteboardToolsComponent,
        ProgressBarComponent
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

    matDialog = TestBed.get(MatDialog);
    openDialogSpy = matDialog.open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a card on plus button clicked', () => {
    const cardsSizeBeforeClicked = component.cards.length;

    const btns = fixture.debugElement.queryAll(
      By.css('.whiteboard-tools__btn')
    );

    const btnPlus = btns[0].nativeElement;

    btnPlus.click();

    const cardsSizeAfterClicked = component.cards.length;

    expect(cardsSizeAfterClicked).toBe(cardsSizeBeforeClicked + 1);
  });

  it('should open a confirmation dialog if the delete button is clicked', () => {
    const mockDialogRef = {
      afterClosed: () => of(false),
      close: null
    } as MatDialogRef<ConfirmationModalComponent>;
    openDialogSpy.mockReturnValue(mockDialogRef);

    component.onDeleteCard(null);

    expect(openDialogSpy).toHaveBeenCalledTimes(1);
    expect(openDialogSpy).toHaveBeenCalledWith(ConfirmationModalComponent, {
      data: {
        title: 'Verwijderen bevestigen',
        message: 'Weet u zeker dat u deze kaart wil verwijderen?',
        disableConfirm: false
      }
    });
  });

  it('should delete a card from the list of cards when the user confirms', () => {
    const cardsSizeBeforeAdding = component.cards.length;

    const card = {
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    };

    component.cards.push(card);

    const mockDialogRef = {
      afterClosed: () => of(true), // fake confirmation
      close: null
    } as MatDialogRef<ConfirmationModalComponent>;
    openDialogSpy.mockReturnValue(mockDialogRef);

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardsSizeBeforeAdding);
  });

  it('should not delete a card from the list of cards when the user does not confirm', () => {
    const card: Card = {
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    };

    component.cards.push(card);

    const cardsSizeAfterAdding = component.cards.length;

    const mockDialogRef = {
      afterClosed: () => of(false), // fake confirmation
      close: null
    } as MatDialogRef<ConfirmationModalComponent>;
    openDialogSpy.mockReturnValue(mockDialogRef);

    component.onDeleteCard(card);

    expect(component.cards.length).toBe(cardsSizeAfterAdding);
  });

  it('should add a card when checkbox is selected', () => {
    const card = {
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    };
    component.selectedCards = [];

    component.selectCard(card);

    expect(component.selectedCards).toContain(card);
  });

  it('should remove a card when checkbox is selected again', () => {
    const card = {
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    };
    component.selectedCards = [card];

    component.deselectCard(card);

    expect(component.selectedCards).not.toContain(card);
  });

  it('should change the colors of the selected cards when a swatch is clicked', () => {
    const card = {
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    };

    const card2 = {
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    };

    const cards = [card, card2];
    component.selectedCards = [card, card2];
    component.changeSelectedCardsColor('black');
    cards.forEach(c => expect(c.color).toBe('black'));
  });
});

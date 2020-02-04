import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
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
import { CardComponent } from '../card/card.component';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
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
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [
        WhiteboardComponent,
        CardComponent,
        ToolbarComponent,
        ColorlistComponent
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

    const btnPlus = fixture.debugElement.query(
      By.css('.whiteboard-page__btnPlus')
    );

    btnPlus.nativeElement.click();

    const cardsSizeAfterClicked = component.cards.length;

    expect(cardsSizeAfterClicked).toBe(cardsSizeBeforeClicked + 1);
  });

  it('should open a confirmation dialog if the delete button is clicked', () => {
    const mockDialogRef = {
      afterClosed: () => of(false),
      close: null
    } as MatDialogRef<ConfirmationModalComponent>;
    openDialogSpy.mockReturnValue(mockDialogRef);

    component.onDeleteCard(0);

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

    component.cards.push({
      cardContent: '',
      color: null,
      isInputSelected: false,
      top: 0,
      left: 0
    });

    const mockDialogRef = {
      afterClosed: () => of(true), // fake confirmation
      close: null
    } as MatDialogRef<ConfirmationModalComponent>;
    openDialogSpy.mockReturnValue(mockDialogRef);

    component.onDeleteCard(0);

    expect(component.cards.length).toBe(cardsSizeBeforeAdding);
  });

  it('should not delete a card from the list of cards when the user does not confirm', () => {
    component.cards.push({
      cardContent: '',
      color: null,
      isInputSelected: false,
      top: 0,
      left: 0
    });

    const cardsSizeAfterAdding = component.cards.length;

    const mockDialogRef = {
      afterClosed: () => of(false), // fake confirmation
      close: null
    } as MatDialogRef<ConfirmationModalComponent>;
    openDialogSpy.mockReturnValue(mockDialogRef);

    component.onDeleteCard(0);

    expect(component.cards.length).toBe(cardsSizeAfterAdding);
  });
});

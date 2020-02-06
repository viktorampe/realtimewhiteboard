import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CardComponent } from '../card/card.component';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { WhiteboardColorlistComponent } from '../whiteboard-colorlist/whiteboard-colorlist.component';
import { WhiteboardToolsComponent } from '../whiteboard-tools/whiteboard-tools.component';
import { WhiteboardComponent } from './whiteboard.component';

describe('WhiteboardComponent', () => {
  let component: WhiteboardComponent;
  let fixture: ComponentFixture<WhiteboardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, FormsModule, MatIconModule],
      declarations: [
        WhiteboardComponent,
        CardComponent,
        ToolbarComponent,
        ColorlistComponent,
        WhiteboardToolsComponent,
        WhiteboardColorlistComponent
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

    const btns = fixture.debugElement.queryAll(
      By.css('.whiteboard-tools__btn')
    );

    const btnPlus = btns[0].nativeElement;

    btnPlus.click();

    const cardsSizeAfterClicked = component.cards.length;

    expect(cardsSizeAfterClicked).toBe(cardsSizeBeforeClicked + 1);
  });

  it('should remove a created card from the array of cards', () => {
    const cardsSizeBeforeAdding = component.cards.length;

    component.cards.push({
      description: '',
      image: null,
      color: null,
      isInputSelected: false,
      editMode: true,
      top: 0,
      left: 0
    });

    component.onDeleteCard(0);

    expect(component.cards.length).toBe(cardsSizeBeforeAdding);
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
});

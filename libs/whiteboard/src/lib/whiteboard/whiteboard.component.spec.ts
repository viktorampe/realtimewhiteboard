import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CardComponent } from '../card/card.component';
import { WhiteboardComponent } from './whiteboard.component';

describe('WhiteboardComponent', () => {
  let component: WhiteboardComponent;
  let fixture: ComponentFixture<WhiteboardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [WhiteboardComponent, CardComponent],
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

    const btnPlus = fixture.debugElement.query(
      By.css('.whiteboard-page__btnPlus')
    );

    btnPlus.nativeElement.click();

    const cardsSizeAfterClicked = component.cards.length;

    expect(cardsSizeAfterClicked).toBe(cardsSizeBeforeClicked + 1);
  });
});

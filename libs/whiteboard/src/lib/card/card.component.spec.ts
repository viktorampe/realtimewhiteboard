import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, FormsModule],
      declarations: [CardComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the card content when not editing', () => {
    component.card.cardContent = 'Test content';
    component.card.isInputSelected = false;
    fixture.detectChanges();
    const contentParagraph = fixture.debugElement.query(By.css('p'));
    expect(contentParagraph.nativeElement.textContent.trim()).toBe(
      'Test content'
    );
  });

  it('should display the card content in the input when editing', async () => {
    component.card.cardContent = 'Test content';
    component.card.isInputSelected = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const inputContent = fixture.debugElement.query(By.css('input'));
    expect(inputContent.nativeElement.value.trim()).toBe('Test content');
  });

  /*
it('should toggle to edit mode when double click.', () => {
    component.card.isInputSelected = false;
    component.card.cardContent = 'something that is not null';

    const myCard = fixture.debugElement.query(By.css('.card'));
    myCard.nativeElement.dispatchEvent(new MouseEvent('dblclick')); // use nativeElement so target is set
    fixture.detectChanges();

    expect(component.card.isInputSelected).toBe(true);
  });
    component.card.isInputSelected = false;

    const myCard = fixture.debugElement.query(By.css('.card'));
    myCard.triggerEventHandler('click', new MouseEvent('click'));
    tick(25);
    myCard.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.card.isInputSelected).toBe(true);
  }));
  */
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, FormsModule, MatIconModule],
      declarations: [CardComponent, ToolbarComponent]
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

  it('should set the correct top style on creation', () => {
    component.card.top = 500;

    component.ngOnChanges();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.style.top).toBe('500px');
  });

  it('should set the correct left style on creation', () => {
    component.card.left = 500;

    component.ngOnChanges();
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.style.left).toBe('500px');
  });
});

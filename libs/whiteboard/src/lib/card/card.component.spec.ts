import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ColorlistComponent } from '../colorlist/colorlist.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, FormsModule, MatIconModule],
      declarations: [CardComponent, ToolbarComponent, ColorlistComponent]
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

  it('should toggle input where input is valid', () => {
    component.card.cardContent = 'Valid';
    component.toggleInput();
    expect(component.card.isInputSelected).toBe(false);
  });

  it('should toggle input where input is empty', () => {
    component.card.cardContent = '';
    component.toggleInput();
    expect(component.card.isInputSelected).toBe(true);
  });

  it('should show errormessage when input is maximal', () => {
    component.card.cardContent = 'a'.repeat(component.maxCharacters);
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.query(
      By.css('.card__content__errorMessage')
    );
    expect(errorMessage).not.toBeNull();
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
    const inputContent = fixture.debugElement.query(By.css('textarea'));
    expect(inputContent.nativeElement.value.trim()).toBe('Test content');
  });

  it('should create card with cardcontent empty', () => {
    expect(component.card.cardContent).toBe('');
  });

  it('should show the colorlist when the coloricon is clicked', () => {
    component.showColor();
    fixture.detectChanges();
    expect(component.colorlistHidden).toBe(false);
  });

  it('should hide the colorlist when the coloricon is clicked twice', () => {
    component.showColor();
    fixture.detectChanges();
    component.showColor();
    fixture.detectChanges();
    expect(component.colorlistHidden).toBe(true);
  });

  it('should close the colorlist when a color is clicked', () => {
    component.showColor();
    fixture.detectChanges();
    component.selectColor('white');
    fixture.detectChanges();
    expect(component.colorlistHidden).toBe(true);
  });

  it('should change the cardcolor when a color is picked', () => {
    component.showColor();
    fixture.detectChanges();
    component.selectColor('black');
    fixture.detectChanges();
    expect(component.card.color).toBe('black');
  });
});

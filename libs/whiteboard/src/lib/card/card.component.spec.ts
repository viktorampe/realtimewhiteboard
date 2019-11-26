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

  it('should show the colorlist when the coloricon is clicked', () => {
    component.colorIconClicked = true;
    fixture.detectChanges();
    expect(component.showColorList).toBe(true);
  });

  it('should close the colorlist when a color is clicked', () => {
    component.colorIconClicked = true;
    fixture.detectChanges();
    component.selectColor('#ffffff');
    fixture.detectChanges();
    expect(component.showColorList).toBe(false);
  });

  it('should change the cardcolor when a color is picked', () => {
    component.selectColor('black');
    fixture.detectChanges();
    expect(component.card.color).toBe('black');
  });
});

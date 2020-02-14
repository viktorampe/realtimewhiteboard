import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Mode } from '../../shared/enums/mode.enum';
import { CardTextComponent } from './card-text.component';

describe('CardTextComponent', () => {
  let component: CardTextComponent;
  let fixture: ComponentFixture<CardTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, MatInputModule],
      declarations: [CardTextComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should show errormessage when no text is provided', () => {
  //   component.text = '';
  //   component.txtContent.markAsDirty();

  //   fixture.detectChanges();

  //   const errorMessage = fixture.debugElement.query(
  //     By.css('[data-cy="errorMissingContent"]')
  //   );
  //   expect(errorMessage).not.toBeNull();
  // });

  it('should show the card content when not editing', () => {
    component.text = 'Test content';
    component.mode = Mode.IdleMode;

    fixture.detectChanges();

    const contentParagraph = fixture.debugElement.query(By.css('.card-text'));
    expect(contentParagraph.nativeElement.textContent.trim()).toBe(
      'Test content'
    );
  });

  it('should display the card content in the input when editing', async () => {
    component.text = 'Test content';
    component.mode = Mode.EditMode;

    fixture.detectChanges();
    await fixture.whenStable();

    const inputContent = fixture.debugElement.query(
      By.css('.card-input__input')
    );
    expect(inputContent.nativeElement.value.trim()).toBe('Test content');
  });
});

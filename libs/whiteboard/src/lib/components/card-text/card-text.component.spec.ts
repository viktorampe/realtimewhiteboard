import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModeEnum } from '../../enums/mode.enum';
import { CardTextComponent } from './card-text.component';

describe('CardTextComponent', () => {
  let component: CardTextComponent;
  let fixture: ComponentFixture<CardTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, BrowserAnimationsModule, MatInputModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ],
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

  it('should show the card content when not editing', () => {
    component.text = 'Test content';
    component.mode = ModeEnum.IDLE;

    fixture.detectChanges();

    const contentParagraph = fixture.debugElement.query(By.css('.card-text'));
    expect(contentParagraph.nativeElement.textContent.trim()).toBe(
      'Test content'
    );
  });

  describe('edit mode', () => {
    const description = 'Test content';
    function getInput() {
      return fixture.debugElement.query(By.css('.card-input__input'));
    }

    beforeEach(() => {
      component.text = description;
      component.mode = ModeEnum.EDIT;

      fixture.detectChanges();
    });

    it('should display the card content in the input when editing', () => {
      expect(getInput().nativeElement.value.trim()).toBe('Test content');
    });
  });

  describe('event handlers', () => {
    it('onChangeText() should emit textChange event', () => {
      spyOn(component.textChange, 'emit');
      component.onChangeText('foo');
      expect(component.textChange.emit).toHaveBeenCalledWith('foo');
    });
  });
});

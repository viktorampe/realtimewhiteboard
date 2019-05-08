import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { ButtonComponent } from '../button/button.component';
import { ContentEditableComponent } from './content-editable.component';

describe('ContentEditableComponent', () => {
  let component: ContentEditableComponent;
  let fixture: ComponentFixture<ContentEditableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentEditableComponent, ButtonComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display the inputs when active is false', () => {
    const input = fixture.debugElement.query(
      By.css('.ui-content-editable__form-field')
    );

    expect(input.styles['display']).toBe('none');
  });

  it('should not display the buttons when active is false', () => {
    const buttons = fixture.debugElement.query(
      By.css('.ui-content-editable__actions')
    );

    expect(buttons).toBeFalsy();
  });

  describe('begin editing (= setting active to true)', () => {
    const text = 'hello';

    beforeEach(fakeAsync(() => {
      component.text = text;
      fixture.detectChanges();
    }));

    it('should display the form field containing the inputs', fakeAsync(() => {
      enableEditing();

      const formField = fixture.debugElement.query(
        By.css('.ui-content-editable__form-field')
      );

      expect(formField.styles['display']).toBeNull();
    }));

    describe('input (no multiline)', () => {
      let inputEl;

      beforeEach(() => {
        inputEl = fixture.debugElement.query(
          By.css('.ui-content-editable__form-field input')
        ).nativeElement;
      });

      it('should focus the input ', fakeAsync(() => {
        spyOn(inputEl, 'focus');

        enableEditing();

        expect(inputEl.focus).toHaveBeenCalled();
      }));

      it('should select all text in the input on focus ', fakeAsync(() => {
        enableEditing();

        expect(inputEl.value).toBe(text);
        expect(inputEl.selectionStart).toBe(0);
        expect(inputEl.selectionEnd).toBe(text.length);
      }));
    });

    describe('textarea (multiline on)', () => {
      let textareaEl;

      beforeEach(() => {
        component.multiline = true;
        fixture.detectChanges();

        textareaEl = fixture.debugElement.query(
          By.css('.ui-content-editable__form-field textarea')
        ).nativeElement;
      });

      it('should focus the textarea ', fakeAsync(() => {
        spyOn(textareaEl, 'focus');

        enableEditing();

        expect(textareaEl.focus).toHaveBeenCalled();
      }));

      it('should select all text in the textarea on focus ', fakeAsync(() => {
        enableEditing();

        expect(textareaEl.value).toBe(text);
        expect(textareaEl.selectionStart).toBe(0);
        expect(textareaEl.selectionEnd).toBe(text.length);
      }));
    });
  });

  describe('editing', () => {
    const defaultText = 'hello';
    const newText = 'world';
    let inputEl, cancelEl;

    beforeEach(fakeAsync(() => {
      component.text = defaultText;
      enableEditing();

      inputEl = fixture.debugElement.query(
        By.css('.ui-content-editable__form-field input')
      ).nativeElement;

      cancelEl = fixture.debugElement.query(
        By.css('.ui-content-editable__actions__cancel')
      ).nativeElement;
    }));

    it('should save changes on pressing enter', () => {
      enterText(inputEl, newText);
      pressEnter(inputEl);

      expect(component.text).toBe(newText);
    });

    it('should save changes when clicking confirm', () => {
      enterText(inputEl, newText);
      clickConfirm();

      expect(component.text).toBe(newText);
    });

    it('should NOT save changes when clicking cancel', () => {
      enterText(inputEl, newText);
      clickCancel();

      expect(component.text).toBe(defaultText);
    });

    it('should NOT save changes when pressing enter with empty value', () => {
      enterText(inputEl, '');
      pressEnter(inputEl);

      expect(component.text).toBe(defaultText);
    });

    it('should not show confirm button if new text is empty', () => {
      enterText(inputEl, '');
      fixture.detectChanges();

      expect(getConfirmButton()).toBeFalsy();
    });

    it('should emit event when changes are confirmed', () => {
      component.textChanged.emit = jest.fn();

      enterText(inputEl, newText);
      pressEnter(inputEl);

      expect(component.textChanged.emit).toHaveBeenCalledWith(newText);
    });

    it('should NOT emit event when confirming with empty value', () => {
      component.textChanged.emit = jest.fn();

      enterText(inputEl, '');
      pressEnter(inputEl);

      expect(component.textChanged.emit).not.toHaveBeenCalled();
    });

    describe('multiline', () => {
      let textareaEl;

      beforeEach(() => {
        component.multiline = true;
        fixture.detectChanges();

        textareaEl = fixture.debugElement.query(
          By.css('.ui-content-editable__form-field textarea')
        ).nativeElement;
      });

      it('should NOT call saveChanges when pressing enter in multiline', () => {
        spyOn(component, 'saveChanges');

        enterText(textareaEl, newText);
        pressEnter(textareaEl);

        expect(component.saveChanges).not.toHaveBeenCalled();
      });
    });

    function enterText(el: any, text: string) {
      el.value = text;
      el.dispatchEvent(new Event('input'));
    }

    function pressEnter(el: any) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    }

    //Confirm button only exists sometimes in the DOM, so the query must be reusable
    function getConfirmButton() {
      return fixture.debugElement.query(
        By.css('.ui-content-editable__actions__confirm')
      );
    }

    function clickConfirm() {
      getConfirmButton().nativeElement.click();
    }

    function clickCancel() {
      cancelEl.click();
    }
  });

  function enableEditing() {
    component.active = true;
    fixture.detectChanges();
    tick();
  }
});

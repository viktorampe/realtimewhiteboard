import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { SearchTermComponent } from './search-term.component';

describe('SearchTermComponent', () => {
  let component: SearchTermComponent;
  let fixture: ComponentFixture<SearchTermComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NoopAnimationsModule,
        MatAutocompleteModule,
        MatInputModule,
        UiModule
      ],
      declarations: [SearchTermComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial value', () => {
    it('should set the intitial value', async(() => {
      spyOn(component.valueChange, 'emit');
      const mockInitialValue = 'Doe iets';

      component.initialValue = mockInitialValue;

      // simulate component initialisation
      component['ngOnInit']();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(
          fixture.debugElement.query(By.css('input')).nativeElement.value
        ).toBe(mockInitialValue);
        expect(component.valueChange.emit).not.toHaveBeenCalled();
      });
    }));
  });

  describe('autofocus', () => {
    it('should set autofocus correctly', async(() => {
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(inputEl.autofocus).toBe(false);

      component.autofocus = true;
      component['ngOnInit']();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(inputEl.autofocus).toBe(true);
      });
    }));
  });

  describe('output', () => {
    it('should emit the search term when the user presses enter', () => {
      spyOn(component.valueChange, 'emit');

      const searchTerm = 'rekenen';
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      inputEl.value = searchTerm;
      inputEl.dispatchEvent(new Event('input'));

      inputEl.focus();
      inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
      expect(component.valueChange.emit).toHaveBeenCalledWith(searchTerm);
    });

    it('should emit the search term when there is input', () => {
      spyOn(component.valueChange, 'emit');
      component.emitOnTextChange = true;
      const searchTerm = 'rekenen';
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      inputEl.value = searchTerm;
      inputEl.dispatchEvent(new Event('input'));
      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(component.valueChange.emit).toHaveBeenCalledWith('rekenen');
    });

    it('should hide the search icon when emitOnTextChange is true', () => {
      component.emitOnTextChange = true;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('campus-button'))).toBeNull();
    });

    it('should emit the search term when the user clicks search button', () => {
      spyOn(component.valueChange, 'emit');

      const searchTerm = 'rekenen';
      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
      inputEl.value = searchTerm;
      inputEl.dispatchEvent(new Event('input'));

      const buttonEl = fixture.debugElement.query(By.css('campus-button'))
        .nativeElement;
      buttonEl.dispatchEvent(new Event('click'));

      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
      expect(component.valueChange.emit).toHaveBeenCalledWith(searchTerm);
    });

    it('should emit the search term when the user selects an autoComplete value', () => {
      component.autoComplete = true;
      component.autoCompleteValues = ['waarde1', 'waarde2'];

      fixture.detectChanges();

      spyOn(component.valueChange, 'emit');

      const autoComplete = fixture.debugElement.query(
        By.directive(MatAutocomplete)
      ).componentInstance as MatAutocomplete;

      // set selected option as currentValue
      component.currentValue = autoComplete.options.first.value;

      // doublecheck that setting currentValue didn't trigger the valueChange
      expect(component.valueChange.emit).not.toHaveBeenCalled();

      // emit event
      autoComplete._emitSelectEvent(autoComplete.options.first);

      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
      expect(component.valueChange.emit).toHaveBeenCalledWith(
        component.currentValue
      );
    });
  });

  describe('autoComplete', () => {
    describe('with autoComplete', () => {
      it('should include an input with the autocomplete attribute', () => {
        expect(
          fixture.debugElement.query(By.css('input')).attributes['autocomplete']
        ).toBeDefined();
      });

      it('should include a mat-autocomplete element', () => {
        const matAutoComplete = fixture.debugElement.query(
          By.css('mat-autocomplete')
        );

        expect(matAutoComplete).toBeDefined();
      });

      it('should add the autoCompleteValues to the mat-autocomplete element', () => {
        component.autoCompleteValues = ['1', '2', '3', '4'];
        fixture.detectChanges();

        const matAutoComplete = fixture.debugElement.query(
          By.css('mat-autocomplete')
        ).componentInstance as MatAutocomplete;

        const matAutoCompleteValues = matAutoComplete.options
          .toArray()
          .map(option => option.value);

        expect(matAutoCompleteValues.length).toBe(
          component.autoCompleteValues.length
        );

        component.autoCompleteValues.forEach(value =>
          expect(matAutoCompleteValues.includes(value))
        );
      });

      it('should emit values in valueChangeForAutoComplete', () => {
        component.valueChangeForAutoComplete.emit = jest.fn();

        const searchTerm = 'rekenen';
        const inputEl = fixture.debugElement.query(By.css('input'))
          .nativeElement;
        inputEl.value = searchTerm;
        inputEl.dispatchEvent(new Event('input'));

        expect(component.valueChangeForAutoComplete.emit).toHaveBeenCalled();
        expect(component.valueChangeForAutoComplete.emit).toHaveBeenCalledWith(
          searchTerm
        );
      });

      it('should not emit values in valueChangeForAutoComplete when the searchTerm is less than 2 characters', () => {
        component.valueChangeForAutoComplete.emit = jest.fn();

        const searchTerm = 'r';
        const inputEl = fixture.debugElement.query(By.css('input'))
          .nativeElement;
        inputEl.value = searchTerm;
        inputEl.dispatchEvent(new Event('input'));

        expect(
          component.valueChangeForAutoComplete.emit
        ).not.toHaveBeenCalled();
      });
    });

    describe('without autoComplete', () => {
      beforeEach(() => {
        component.autoComplete = false;
        fixture.detectChanges();
      });

      it('should not include an input with the autocomplete attribute', () => {
        expect(
          fixture.debugElement.query(By.css('input')).attributes['autocomplete']
        ).toBeFalsy();
      });

      it('should not include a mat-autocomplete element', () => {
        const matAutoComplete = fixture.debugElement.query(
          By.css('mat-autocomplete')
        );

        expect(matAutoComplete).toBeFalsy();
      });

      it('should not emit values in valueChangeForAutoComplete', () => {
        component.valueChangeForAutoComplete.emit = jest.fn();

        const searchTerm = 'rekenen';
        const inputEl = fixture.debugElement.query(By.css('input'))
          .nativeElement;
        inputEl.value = searchTerm;
        inputEl.dispatchEvent(new Event('input'));

        expect(
          component.valueChangeForAutoComplete.emit
        ).not.toHaveBeenCalled();
      });
    });
  });
});

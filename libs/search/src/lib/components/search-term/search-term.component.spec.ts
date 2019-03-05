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
    }).compileComponents();
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

  describe('output', () => {
    it('should emit a value when the user presses enter', () => {
      spyOn(component.valueChange, 'emit');

      const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

      inputEl.focus();
      inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(component.valueChange.emit).toHaveBeenCalled();
      expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('autoComplete', () => {
    describe('with autoComplete', () => {
      beforeEach(() => {
        component.autoComplete = true;
        fixture.detectChanges();
      });

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
    });

    describe('without autoComplete', () => {
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
    });
  });
});

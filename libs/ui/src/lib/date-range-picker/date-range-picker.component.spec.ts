import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { BeDateAdapter } from './be-date-adapter';
import { DateRangePickerComponent } from './date-range-picker.component';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NoopAnimationsModule
      ],
      declarations: [DateRangePickerComponent],
      providers: [{ provide: DateAdapter, useClass: BeDateAdapter }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    describe('requireStart', () => {
      describe('false', () => {
        it("should not set the 'required' validator on startDate", () => {
          setInput('requireStart', false);
          fixture.detectChanges();

          const validators = getValidatorsFor('startDate');

          expect(validators).toBe(null);
        });

        it("should not set the 'required' validator on startTime", () => {
          setInput('requireStart', false);
          fixture.detectChanges();

          const validators = getValidatorsFor('startTime');

          expect(validators).toBe(null);
        });
      });

      describe('true', () => {
        it("should set the 'required' validator on startDate", () => {
          setInput('requireStart', true);
          fixture.detectChanges();

          const validators = getValidatorsFor('startDate');

          expect(validators).toEqual({ required: true });
        });

        it("should set the 'required' validator on startTime", () => {
          setInput('requireStart', true);
          fixture.detectChanges();

          const validators = getValidatorsFor('startTime');

          expect(validators).toEqual({ required: true });
        });

        it("should not set the 'required' validator on startTime if useTime is false", () => {
          setInput('requireStart', true);
          setInput('useTime', false);
          fixture.detectChanges();

          const validators = getValidatorsFor('startTime');

          expect(validators).toEqual(null);
        });
      });
    });

    describe('requireEnd', () => {
      describe('false', () => {
        it("should not set the 'required' validator on endDate", () => {
          setInput('requireEnd', false);
          fixture.detectChanges();

          const validators = getValidatorsFor('endDate');

          expect(validators).toBe(null);
        });

        it("should not set the 'required' validator on endTime", () => {
          setInput('requireEnd', false);
          fixture.detectChanges();

          const validators = getValidatorsFor('endTime');

          expect(validators).toBe(null);
        });
      });

      describe('true', () => {
        it("should set the 'required' validator on endDate", () => {
          setInput('requireEnd', true);
          fixture.detectChanges();

          const validators = getValidatorsFor('endDate');

          expect(validators).toEqual({ required: true });
        });

        it("should set the 'required' validator on endTime", () => {
          setInput('requireEnd', true);
          fixture.detectChanges();

          const validators = getValidatorsFor('endTime');

          expect(validators).toEqual({ required: true });
        });

        it("should not set the 'required' validator on endTime if useTime is false", () => {
          setInput('requireEnd', true);
          setInput('useTime', false);
          fixture.detectChanges();

          const validators = getValidatorsFor('endTime');

          expect(validators).toEqual(null);
        });
      });
    });

    describe('useTime', () => {
      it('should display the time controls if useTime is true', () => {
        setInput('useTime', true);
        fixture.detectChanges();

        const timeInputs = fixture.debugElement.queryAll(
          By.css('input[type=time]')
        );

        expect(timeInputs.length).toBe(2);
      });

      it('should not display the time controls if useTime is false', () => {
        setInput('useTime', false);
        fixture.detectChanges();

        const timeInputs = fixture.debugElement.queryAll(
          By.css('input[type=time]')
        );

        expect(timeInputs.length).toBe(0);
      });
    });

    describe('vertical', () => {
      it('should set the vertical class on the form if vertical is true', () => {
        setInput('vertical', true);
        fixture.detectChanges();

        const vertical = fixture.debugElement.query(
          By.css('.ui-date-range-picker--vertical')
        );

        expect(vertical).toBeTruthy();
      });

      it('should not set the vertical class on the form if vertical is false', () => {
        setInput('vertical', false);
        fixture.detectChanges();

        const vertical = fixture.debugElement.query(
          By.css('.ui-date-range-picker--vertical')
        );

        expect(vertical).toBeFalsy();
      });
    });

    describe('initialValues', () => {
      const someDate = new Date('1 sept 2000');
      const someTime = '13:37';

      it('should set the startDate value to initialStartDate if provided', () => {
        setInput('initialStartDate', someDate);
        fixture.detectChanges();

        expect(component.dateRangeForm.get('startDate').value).toBe(someDate);
      });

      it('should set the startTime value to initialStartTime if provided', () => {
        setInput('initialStartTime', someTime);
        fixture.detectChanges();

        expect(component.dateRangeForm.get('startTime').value).toBe(someTime);
      });

      it('should set the endDate value to initialEndDate if provided', () => {
        setInput('initialEndDate', someDate);
        fixture.detectChanges();

        expect(component.dateRangeForm.get('endDate').value).toBe(someDate);
      });

      it('should set the endTime value to initialEndTime if provided', () => {
        setInput('initialEndTime', someTime);
        fixture.detectChanges();

        expect(component.dateRangeForm.get('endTime').value).toBe(someTime);
      });
    });
  });

  function setInput(name: string, value: any) {
    const previousValue = component[name];

    component[name] = value;
    component.ngOnChanges({
      [name]: {
        previousValue,
        currentValue: value,
        firstChange: false,
        isFirstChange: () => false
      }
    });
  }

  function getValidatorsFor(controlName: string) {
    const control = component.dateRangeForm.get(controlName);

    // https://stackoverflow.com/questions/43838108/get-validators-present-in-formgroup-formcontrol
    return control.validator && control.validator('' as any);
  }
});

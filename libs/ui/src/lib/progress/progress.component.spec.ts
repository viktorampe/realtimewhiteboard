import { Component, DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatProgressBarModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import {
  CompletedProgressIconDirective,
  ProgressComponent
} from './progress.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-progress',
  template: `
    <campus-progress
      withCompletedIconIncomplete
      [count]="50"
      [total]="100"
      [showPercentage]="true"
    >
      <completed-progress-icon>TEST ICON</completed-progress-icon>
    </campus-progress>
    <campus-progress
      withCompletedIcon
      [count]="100"
      [total]="100"
      [showPercentage]="true"
    >
      <completed-progress-icon>TEST ICON</completed-progress-icon>
    </campus-progress>
    <campus-progress
      withoutCompletedIcon
      [count]="100"
      [total]="100"
      [showPercentage]="true"
    >
    </campus-progress>
  `
})
export class TestProgressComponent {}

describe('ProgressComponent', () => {
  let component: ProgressComponent;
  let fixture: ComponentFixture<ProgressComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProgressComponent,
        TestProgressComponent,
        CompletedProgressIconDirective
      ],
      imports: [MatProgressBarModule, MatProgressSpinnerModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('percentage label', () => {
    it('should calculate and ceil the percentage with a given count and default total', () => {
      const changes = {
        count: new SimpleChange(0, 49, false)
      };

      component.ngOnChanges(changes);
      fixture.detectChanges();

      expect(component.percentage).toBe(49);
    });
    it('should calculate and ceil the percentage with a given count and a given total', () => {
      const changes = {
        count: new SimpleChange(0, 49, false),
        total: new SimpleChange(100, 55, false)
      };

      component.ngOnChanges(changes);
      fixture.detectChanges();

      expect(component.percentage).toBe(90);
    });
    it('should render percentage label when showPercentage is true', () => {
      component.showPercentage = true;
      const changes = {
        count: new SimpleChange(0, 60, false)
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();

      const percentageLabelDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-percentage-label]')
      );
      expect(percentageLabelDE).not.toBeNull();
      expect(percentageLabelDE.nativeElement.textContent).toBe('60%');
    });
    it('should not render percentage label when showPercentage is false', () => {
      component.showPercentage = false;
      fixture.detectChanges();
      const percentageLabelDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-percentage-label]')
      );
      expect(percentageLabelDE).toBeNull();
    });
    it('should not render percentage label by default', () => {
      const percentageLabelDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-percentage-label]')
      );
      expect(percentageLabelDE).toBeNull();
    });
  });
  describe('completed icon', () => {
    let containerFixture: ComponentFixture<TestProgressComponent>;
    let progresses: DebugElement[];

    beforeEach(() => {
      containerFixture = TestBed.createComponent(TestProgressComponent);
      containerFixture.detectChanges();
      progresses = containerFixture.debugElement.queryAll(
        By.directive(ProgressComponent)
      );
    });

    it('should render percentage label if completedIcon has content and percentage is less than 100', () => {
      const label = progresses[0].query(
        By.css('[data-cy=ui-progress-percentage-label]')
      );
      const icon = progresses[0].query(
        By.css('[data-cy=ui-progress-completed-icon')
      );

      expect(label).not.toBeNull();
      expect(icon).toBeNull();
    });
    it('should not render percentage label if completedIcon has content and percentage is 100', () => {
      const label = progresses[1].query(
        By.css('[data-cy=ui-progress-percentage-label]')
      );
      const icon = progresses[1].query(
        By.css('[data-cy=ui-progress-completed-icon')
      );

      expect(label).toBeNull();
      expect(icon).not.toBeNull();
    });
    it('should render percentage label if completedIcon has no  content', () => {
      const label = progresses[2].query(
        By.css('[data-cy=ui-progress-percentage-label]')
      );
      const icon = progresses[2].query(
        By.css('[data-cy=ui-progress-completed-icon')
      );
      expect(label).not.toBeNull();
      expect(icon).toBeNull();
    });
  });

  describe('Spinner Form', () => {
    it('should show the linear progress bar when form is linear', () => {
      component.form = component.forms.LINEAR;
      fixture.detectChanges();

      const progressBarDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-bar]')
      );
      const progressSpinnerDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-spinner]')
      );
      expect(progressBarDE).not.toBeNull();
      expect(progressSpinnerDE).toBeNull();
    });

    it('should show the spinner progress bar when form is circular', () => {
      component.form = component.forms.CIRCULAR;
      fixture.detectChanges();

      const progressBarDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-bar]')
      );
      const progressSpinnerDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-spinner]')
      );
      expect(progressBarDE).toBeNull();
      expect(progressSpinnerDE).not.toBeNull();
    });

    it('should show the spinner progress bar by default', () => {
      const progressBarDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-bar]')
      );
      const progressSpinnerDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-spinner]')
      );
      expect(progressBarDE).toBeNull();
      expect(progressSpinnerDE).not.toBeNull();
    });

    it('should set width and height on container with a given diameter when form is circular', () => {
      component.diameter = 200;
      component.form = component.forms.CIRCULAR;
      fixture.detectChanges();
      const containerDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-container]')
      );
      expect(containerDE.nativeElement.style.width).toBe('200px');
      expect(containerDE.nativeElement.style.height).toBe('200px');
    });
    it('should ignore setting width and height on container with a given diameter when form is linear', () => {
      component.diameter = 200;
      component.form = component.forms.LINEAR;
      fixture.detectChanges();
      const containerDE = fixture.debugElement.query(
        By.css('[data-cy=ui-progress-container]')
      );
      expect(containerDE.nativeElement.style.width).toBeFalsy();
      expect(containerDE.nativeElement.style.height).toBeFalsy();
    });
  });
  describe('Spinner Mode', () => {
    it('should have indeterminate mode if no count is given', () => {
      expect(component.mode).toBe(component.modes.INDETERMINATE);
    });
    it('should have determinate mode if count is given', () => {
      const changes = {
        count: new SimpleChange(undefined, 20, true)
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();
      expect(component.mode).toBe(component.modes.DETERMINATE);
    });
  });
});

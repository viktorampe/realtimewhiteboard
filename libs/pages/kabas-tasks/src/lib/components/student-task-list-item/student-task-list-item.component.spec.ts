import { ChangeDetectorRef, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ENVIRONMENT_ICON_MAPPING_TOKEN } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { StudentTaskListItemComponent } from './student-task-list-item.component';

describe('StudentTaskListItemComponent', () => {
  let component: StudentTaskListItemComponent;
  let fixture: ComponentFixture<StudentTaskListItemComponent>;
  let cd: ChangeDetectorRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, UiModule],
      declarations: [StudentTaskListItemComponent],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: ENVIRONMENT_ICON_MAPPING_TOKEN, useValue: {} },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTaskListItemComponent);
    cd = fixture.componentRef.injector.get<ChangeDetectorRef>(
      ChangeDetectorRef as Type<ChangeDetectorRef>
    );
    component = fixture.componentInstance;
    component.title = 'foo';
    component.actions = [
      { label: 'Action1', handler: jest.fn() },
      { label: 'Action2', handler: jest.fn() }
    ];
    component.urgent = false;
    component.dateLabel = 'morgen';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should pass action handlers', () => {
      const actionDEs = fixture.debugElement.queryAll(
        By.css(
          '.manage-kabas-tasks-student-task-list-item__container__actions > .ui-button'
        )
      );

      expect(actionDEs.length).toBe(component.actions.length);
      actionDEs.forEach((actionDE, index) => {
        const action = component.actions[index];

        expect(actionDE.nativeElement.textContent).toBe(action.label);

        actionDE.nativeElement.click();
        expect(action.handler).toHaveBeenCalled();
      });
    });

    describe('dateLabel', () => {
      it('should not have the urgent class when component.urgent is false', () => {
        component.urgent = false;
        cd.detectChanges();

        const dateLabelDE = fixture.debugElement.query(
          By.css('[data-cy=tli-date-label]')
        );

        expect(
          dateLabelDE.nativeElement.classList.contains(
            'manage-kabas-tasks-student-task-list-item__date-label--urgent'
          )
        ).toBeFalsy();
      });

      it('should have the urgent class when component.urgent is true', () => {
        component.urgent = true;
        cd.detectChanges();

        const dateLabelDE = fixture.debugElement.query(
          By.css('[data-cy=tli-date-label]')
        );

        expect(
          dateLabelDE.nativeElement.classList.contains(
            'manage-kabas-tasks-student-task-list-item__date-label--urgent'
          )
        ).toBeTruthy();
      });
    });

    describe('progress', () => {
      it('should not show progress when totalRequired = 0', () => {
        component.finished = false;
        component.totalRequired = 0;
        cd.detectChanges();

        const progressDE = fixture.debugElement.query(
          By.css('[data-cy=tli-progress]')
        );

        expect(progressDE).toBeFalsy();
      });

      it('should not show progress when finished = true', () => {
        component.finished = true;
        component.totalRequired = 5;
        cd.detectChanges();

        const progressDE = fixture.debugElement.query(
          By.css('[data-cy=tli-progress]')
        );

        expect(progressDE).toBeFalsy();
      });

      it('should show progress when totalRequired > 0', () => {
        component.finished = false;
        component.totalRequired = 5;
        cd.detectChanges();

        const progressDE = fixture.debugElement.query(
          By.css('[data-cy=tli-progress]')
        );

        expect(progressDE).toBeTruthy();
      });
    });
  });
});

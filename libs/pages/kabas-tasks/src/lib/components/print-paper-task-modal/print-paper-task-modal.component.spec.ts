import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MatIconRegistry,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { PrintPaperTaskModalDataInterface } from './print-paper-task-modal-data.interface';
import { PrintPaperTaskModalResultEnum } from './print-paper-task-modal-result.enum';
import { PrintPaperTaskModalComponent } from './print-paper-task-modal.component';

describe('PrintPaperTaskModalComponent', () => {
  let component: PrintPaperTaskModalComponent;
  let fixture: ComponentFixture<PrintPaperTaskModalComponent>;
  let dialogRef: MatDialogRef<PrintPaperTaskModalComponent>;

  const data: PrintPaperTaskModalDataInterface = {
    disable: []
  };
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPaperTaskModalComponent],
      imports: [MatDialogModule, UiModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { ...data } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MatIconRegistry,
          useClass: MockMatIconRegistry
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPaperTaskModalComponent);
    dialogRef = TestBed.get(MatDialogRef);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // file.only
  describe('print actions', () => {
    beforeEach(() => {
      dialogRef.close = jest.fn();
    });
    it('should close with print action without names', () => {
      component.clickPrintTask(false);
      expect(dialogRef.close).toHaveBeenCalledWith(
        PrintPaperTaskModalResultEnum.WITHOUT_NAMES
      );
    });

    it('should close with print action with names', () => {
      component.clickPrintTask(true);
      expect(dialogRef.close).toHaveBeenCalledWith(
        PrintPaperTaskModalResultEnum.WITH_NAMES
      );
    });

    it('should close with print solution action', () => {
      component.clickPrintSolution();
      expect(dialogRef.close).toHaveBeenCalledWith(
        PrintPaperTaskModalResultEnum.SOLUTION
      );
    });
  });

  describe('cancel action', () => {
    it('should close panel with cancel', () => {
      dialogRef.close = jest.fn();
      component.clickCancel();
      expect(dialogRef.close).toHaveBeenCalledWith(
        PrintPaperTaskModalResultEnum.CANCEL
      );
    });
  });

  describe('disable data', () => {
    it('should return disabled if in disable data', () => {
      component['data'].disable = [PrintPaperTaskModalResultEnum.WITHOUT_NAMES];
      fixture.detectChanges();
      expect(
        component.isButtonDisabled(PrintPaperTaskModalResultEnum.WITHOUT_NAMES)
      ).toBeTruthy();
    });

    it('should add disable class to all buttons in disable data', () => {
      component['data'].disable = [
        PrintPaperTaskModalResultEnum.WITHOUT_NAMES,
        PrintPaperTaskModalResultEnum.WITH_NAMES,
        PrintPaperTaskModalResultEnum.SOLUTION
      ];
      fixture.detectChanges();

      const buttonDEs = fixture.debugElement.queryAll(
        By.css('.print-paper-taks__container__link')
      );

      buttonDEs.forEach(button => {
        expect(button.nativeElement.classList).toContain(
          'print-paper-taks__container__link--disabled'
        );
      });
    });
  });

  describe('components', () => {
    it('should show 3 print buttons', () => {
      const buttonDEs = fixture.debugElement.queryAll(
        By.css('.print-paper-taks__container__link')
      );

      [
        'Afdrukken met namen',
        'Afdrukken zonder namen',
        'Correctiesleutel afdrukken'
      ].forEach((label, index) => {
        expect(buttonDEs[index].nativeElement.textContent.trim()).toBe(label);
      });
    });

    it('should show a cancel button', () => {
      const buttonDEs = fixture.debugElement.queryAll(
        By.css('.print-paper-taks__actions__button')
      );

      expect(buttonDEs[0].nativeElement.textContent.trim()).toBe('Annuleren');

      component.clickCancel = jest.fn();
      buttonDEs[0].triggerEventHandler('click', null);

      expect(component.clickCancel).toHaveBeenCalled();
    });
  });
});

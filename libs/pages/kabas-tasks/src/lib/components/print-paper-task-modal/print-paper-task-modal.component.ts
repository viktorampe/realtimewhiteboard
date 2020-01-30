import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrintPaperTaskModalDataInterface } from './print-paper-task-modal-data.interface';
import { PrintPaperTaskModalResultEnum } from './print-paper-task-modal-result.enum';

@Component({
  selector: 'campus-print-paper-task-modal',
  templateUrl: './print-paper-task-modal.component.html',
  styleUrls: ['./print-paper-task-modal.component.scss']
})
export class PrintPaperTaskModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: PrintPaperTaskModalDataInterface = { disable: [] },
    private dialogRef: MatDialogRef<PrintPaperTaskModalComponent>
  ) {}

  public printEnum = PrintPaperTaskModalResultEnum;
  public actions = [];
  public ngOnInit() {
    this.actions = [
      {
        label: 'Afdrukken met namen',
        handler: () => this.clickPrintTask(true),
        tooltip: this.isButtonDisabled(PrintPaperTaskModalResultEnum.WITH_NAMES)
          ? 'Deze taak is aan niemand toegekend.'
          : '',
        disabled: this.isButtonDisabled(
          PrintPaperTaskModalResultEnum.WITH_NAMES
        )
      },
      {
        label: 'Afdrukken zonder namen',
        handler: () => this.clickPrintTask(false),
        tooltip: '',
        disabled: this.isButtonDisabled(
          PrintPaperTaskModalResultEnum.WITHOUT_NAMES
        )
      },
      {
        label: 'Correctiesleutel afdrukken',
        handler: () => this.clickPrintSolution(),
        tooltip: '',
        disabled: this.isButtonDisabled(PrintPaperTaskModalResultEnum.SOLUTION)
      }
    ];
  }

  public isButtonDisabled(type: PrintPaperTaskModalResultEnum) {
    return this.data.disable && this.data.disable.includes(type);
  }
  public clickPrintTask(withNames: boolean) {
    this.dialogRef.close(
      withNames
        ? PrintPaperTaskModalResultEnum.WITH_NAMES
        : PrintPaperTaskModalResultEnum.WITHOUT_NAMES
    );
  }
  public clickPrintSolution() {
    this.dialogRef.close(PrintPaperTaskModalResultEnum.SOLUTION);
  }
  public clickCancel() {
    this.dialogRef.close(PrintPaperTaskModalResultEnum.CANCEL);
  }
}

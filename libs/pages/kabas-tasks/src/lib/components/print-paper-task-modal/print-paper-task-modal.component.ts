import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrintPaperTaskModalDataInterface } from './print-paper-task-modal-data.interface';
import { PrintPaperTaskModalResultEnum } from './print-paper-task-modal-result.enum';

@Component({
  selector: 'campus-print-paper-task-modal',
  templateUrl: './print-paper-task-modal.component.html',
  styleUrls: ['./print-paper-task-modal.component.scss']
})
export class PrintPaperTaskModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: PrintPaperTaskModalDataInterface,
    private dialogRef: MatDialogRef<PrintPaperTaskModalComponent>
  ) {}

  public printEnum = PrintPaperTaskModalResultEnum;

  public isButtonDisabled(type: PrintPaperTaskModalResultEnum) {
    return this.data.disable.includes(type);
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

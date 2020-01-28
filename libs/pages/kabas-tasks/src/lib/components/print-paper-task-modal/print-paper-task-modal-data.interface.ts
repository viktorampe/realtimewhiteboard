import { PrintPaperTaskModalResultEnum } from './print-paper-task-modal-result.enum';

export interface PrintPaperTaskModalDataInterface {
  label: string;
  value: PrintPaperTaskModalResultEnum;
  isDisabled: boolean;
}

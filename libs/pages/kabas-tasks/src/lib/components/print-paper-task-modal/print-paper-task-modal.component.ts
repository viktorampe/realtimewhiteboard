import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-print-paper-task-modal',
  templateUrl: './print-paper-task-modal.component.html',
  styleUrls: ['./print-paper-task-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintPaperTaskModalComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}

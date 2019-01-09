import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-teacher-summary',
  templateUrl: './teacher-summary.component.html',
  styleUrls: ['./teacher-summary.component.scss']
})
export class TeacherSummaryComponent {
  @Input() name: string;
  @Input() imageUrl: string;
  @Input() code: string;
  @Input() dateString: string;
  @Input() learningAreasString: string;
  @Output() deleteClicked = new EventEmitter<boolean>();

  clickDelete(): void {
    this.deleteClicked.emit(true);
  }
}

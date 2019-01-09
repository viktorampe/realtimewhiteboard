import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'campus-teacher-summary-component',
  templateUrl: './teacher-summary-component.component.html',
  styleUrls: ['./teacher-summary-component.component.scss']
})
export class TeacherSummaryComponentComponent {
  @Input() imageUrl: string;
  @Input() code: string;
  @Input() dateString: string;
  @Input() learningAreasString: string;
  @Output() deleteClicked = new EventEmitter<boolean>();

  clickDelete(): void {
    console.log('deleted');
    this.deleteClicked.emit(true);
  }
}

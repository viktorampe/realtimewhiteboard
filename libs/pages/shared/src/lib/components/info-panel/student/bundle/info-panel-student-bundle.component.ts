import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-student-bundle',
  templateUrl: './info-panel-student-bundle.component.html',
  styleUrls: ['./info-panel-student-bundle.component.scss']
})
export class InfoPanelStudentBundleComponent {
  @Input() titleText: string;
  @Input() displayName: string;
  @Input() name: string;
  @Input() description: string;
}

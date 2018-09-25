import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-bundle',
  templateUrl: './info-panel-bundle.component.html',
  styleUrls: ['./info-panel-bundle.component.scss']
})
export class InfoPanelBundleComponent {
  @Input() teacherDisplayName: string;
  @Input() bundleName: string;
  @Input() bundleDescription: string;
}

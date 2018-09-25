import { Component, Input } from '@angular/core';

@Component({
  selector: 'campus-info-panel-bundle',
  templateUrl: './info-panel-bundle.component.html',
  styleUrls: ['./info-panel-bundle.component.scss']
})
export class InfoPanelBundleComponent {
  @Input() bundle: { name: string, description: string, teacher: { displayName: string } };
}

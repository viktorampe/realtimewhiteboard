import { Component, Input } from '@angular/core';
import { BundleInterface } from '@campus/dal';
import { BadgePersonInterface } from '@campus/ui';

@Component({
  selector: 'campus-info-panel-bundle',
  templateUrl: './info-panel-bundle.component.html',
  styleUrls: ['./info-panel-bundle.component.scss']
})
export class InfoPanelBundleComponent {
  @Input() bundle: BundleInterface;
  @Input() teacher: BadgePersonInterface;
}

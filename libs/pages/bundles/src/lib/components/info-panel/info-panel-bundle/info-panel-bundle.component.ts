import { Component, Input } from '@angular/core';
import { BadgePersonInterface } from '@campus/ui';
import { BundleInterface } from '@diekeure/polpo-api-angular-sdk';

@Component({
  selector: 'campus-info-panel-bundle',
  templateUrl: './info-panel-bundle.component.html',
  styleUrls: ['./info-panel-bundle.component.scss']
})
export class InfoPanelBundleComponent {
  @Input() bundle: BundleInterface;
  @Input() teacher: BadgePersonInterface;
}

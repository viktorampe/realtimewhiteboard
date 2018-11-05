import { Component, Input } from '@angular/core';
import { BadgePersonInterface } from '@campus/ui';

@Component({
  selector: 'campus-info-panel-bundle',
  templateUrl: './info-panel-bundle.component.html',
  styleUrls: ['./info-panel-bundle.component.scss']
})
export class InfoPanelBundleComponent {
  @Input()
  bundle: {
    name: string;
    description: string;
    teacher: BadgePersonInterface;
  };
}

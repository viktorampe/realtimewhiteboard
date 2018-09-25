import { Component, ViewChild } from '@angular/core';
import { SideSheetComponent } from '@campus/ui';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent {
  isOpenOnInit = true;
  @ViewChild('sideSheet') sideSheet: SideSheetComponent;

  toggleSideSheet() {
    this.sideSheet.toggle();
  }
}

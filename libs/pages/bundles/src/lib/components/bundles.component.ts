import { Component, ViewChild } from '@angular/core';
import { SideSheetComponent } from '@campus/ui';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent {
  options = [
    { value: 23, viewValue: 'one' },
    { value: 39, viewValue: 'two' },
    { value: 30, viewValue: 'three' }
  ];

  isOpenOnInit = true;
  @ViewChild('sideSheet') sideSheet: SideSheetComponent;

  toggleSideSheet() {
    this.sideSheet.toggle();
  }

  onClickConfirm(eventData): void {
    console.log('eventData');
    console.log(eventData);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { SideSheetComponent } from '@campus/ui';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  isOpenOnInit = true;
  @ViewChild('sideSheet') sideSheet: SideSheetComponent;

  constructor() {}
  ngOnInit() {}

  toggleSideSheet() {
    this.sideSheet.toggle();
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  lineView: boolean;
  toolbarFixed: boolean;

  ngOnInit() {
    this.lineView = false;
    this.toolbarFixed = true;
  }
}

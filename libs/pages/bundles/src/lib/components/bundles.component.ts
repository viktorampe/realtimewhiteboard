import { Component } from '@angular/core';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent {
  saveStatus(eventValue: any) {
    console.log(eventValue);
  }
}

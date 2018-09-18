import { Component } from '@angular/core';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent {
  period = { start: new Date(2018, 0, 1), end: new Date(2019, 5, 1) };
  saveStatus(eventValue: any) {
    console.log(eventValue);
  }

}

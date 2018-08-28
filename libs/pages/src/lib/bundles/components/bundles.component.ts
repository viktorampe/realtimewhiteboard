import { Component } from '@angular/core';
import { BundlesViewModel } from './bundles.viewmodel';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent {
  constructor(private bundlesViewModel: BundlesViewModel) {}

  //TODO add code
}

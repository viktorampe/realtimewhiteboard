import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  showInfoPanel = true;
  showInfo$ = new BehaviorSubject<boolean>(true);
  constructor() {}

  ngOnInit() {}

  showInfo() {
    // we need to change the value, otherwise the setter in the side sheet component won't trigger
    this.showInfoPanel = !this.showInfoPanel;
    this.showInfo$.next(this.showInfoPanel);
  }
}

import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  showInfoPanel = false;
  showInfo$ = new Subject();
  constructor() {}

  ngOnInit() {}

  showInfo() {
    this.showInfoPanel = !this.showInfoPanel;
    this.showInfo$.next(this.showInfoPanel);
  }

  log() {
    console.log('click arrived');
  }
}

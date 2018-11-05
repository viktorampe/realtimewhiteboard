import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'campus-ui-page',
  templateUrl: './ui-page.component.html',
  styleUrls: ['./ui-page.component.scss']
})
export class UiPageComponent implements OnInit {
  list$ = new BehaviorSubject(false);

  constructor() {}

  ngOnInit() {
    this.list$.next(true);
  }
}

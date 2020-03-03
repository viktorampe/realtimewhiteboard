import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'campus-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @HostBinding('class.ui-rating')
  private uiRatingClass = true;

  constructor() {}
}

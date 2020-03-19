import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'campus-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() count: number;
  @Input() total? = 3;
  @Input() svgIcon: string;

  @HostBinding('class.ui-rating')
  private uiRatingClass = true;

  constructor() {}
}

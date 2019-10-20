import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';

@Component({
  selector: 'campus-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent {
  @Input() viewSlides: TimelineViewSlideInterface[];
  @Input() activeViewSlide: TimelineViewSlideInterface;
  @Output() clickSetSlide = new EventEmitter<TimelineViewSlideInterface>();

  slideType = TIMELINE_SLIDE_TYPES.SLIDE;

  public setViewSlide(viewSlide: TimelineViewSlideInterface): void {
    this.clickSetSlide.emit(viewSlide);
  }
}

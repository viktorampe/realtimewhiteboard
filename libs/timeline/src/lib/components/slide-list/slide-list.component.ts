import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimelineViewSlideInterface } from '../../interfaces/timeline';

@Component({
  selector: 'campus-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {
  @Input() viewSlides: TimelineViewSlideInterface[];
  @Input() activeViewSlide: number;

  @Output() clickSetSlide = new EventEmitter<TimelineViewSlideInterface>();
  @Output() clickCreateSlide = new EventEmitter<boolean>();
  @Output() clickCreateEra = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {}

  public setViewSlide(viewSlide: TimelineViewSlideInterface): void {
    this.clickSetSlide.emit(viewSlide);
  }

  public showTimelineSettings(): void {
    this.clickSetSlide.emit(null);
  }

  public createSlide(): void {
    this.clickCreateSlide.emit(true);
  }

  public createEra(): void {
    this.clickCreateEra.emit(true);
  }
}

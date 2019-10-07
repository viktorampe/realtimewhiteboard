import { Component, Input, OnInit } from '@angular/core';
import { TimelineViewSlideInterface } from '../../interfaces/timeline';
import { EditorViewModel } from '../editor.viewmodel';

@Component({
  selector: 'campus-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {
  @Input() viewSlides: TimelineViewSlideInterface[];
  @Input() activeViewSlide: number;

  constructor(private editorViewmodel: EditorViewModel) {}

  ngOnInit() {}

  public clickViewSlide(viewSlide: TimelineViewSlideInterface): void {
    // this.editorViewmodel.setActiveSlide(viewSlide);
  }

  public showTimelineSettings(): void {}
  public createSlide(): void {}
  public createEra(): void {}
}

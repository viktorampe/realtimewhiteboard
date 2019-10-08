import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TimelineSettingsInterface,
  TimelineViewSlideInterface
} from '../../interfaces/timeline';
import { EditorViewModel } from './../editor.viewmodel';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit {
  public slideList$: Observable<TimelineViewSlideInterface[]>;
  public activeSlideDetail$: Observable<TimelineViewSlideInterface>;
  public settings$: Observable<TimelineSettingsInterface>;
  public isFormDirty$: Observable<boolean>;

  constructor(private editorViewModel: EditorViewModel) {}

  @HostBinding('class.timeline-editor') private isTimelineEditor = true;

  ngOnInit() {
    this.slideList$ = this.editorViewModel.slideList$;
    this.activeSlideDetail$ = this.editorViewModel.activeSlideDetail$;
    this.settings$ = this.editorViewModel.settings$;
    this.isFormDirty$ = this.editorViewModel.isFormDirty$;
  }

  public setActiveSlide(viewSlide: TimelineViewSlideInterface): void {
    // this.editorViewModel.setActiveSlide(viewSlide)
  }

  public showSettings(): void {
    // this.editorViewModel.showSettings();
  }

  public createSlide(): void {}

  public createEra(): void {}
}

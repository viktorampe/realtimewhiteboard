import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  TimelineSettingsInterface,
  TimelineViewSlideInterface
} from '../../interfaces/timeline';
import { EditorViewModel } from '../editor.viewmodel';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit, OnChanges {
  public slideList$: Observable<TimelineViewSlideInterface[]>;
  public activeSlide$: Observable<TimelineViewSlideInterface>;
  public activeSlideDetail$: Observable<TimelineViewSlideInterface>;
  public settings$: Observable<TimelineSettingsInterface>;
  public isFormDirty$: Observable<boolean>;

  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;

  constructor(
    private el: ElementRef,
    private editorViewModel: EditorViewModel
  ) {}

  @HostBinding('class.timeline-editor') public isTimelineEditor = true;

  ngOnInit() {
    this.slideList$ = this.editorViewModel.slideList$;
    this.activeSlideDetail$ = this.editorViewModel.activeSlideDetail$;
    this.activeSlide$ = this.editorViewModel.activeSlide$;
    this.settings$ = this.editorViewModel.settings$;
    this.isFormDirty$ = this.editorViewModel.isFormDirty$;

    this.editorViewModel.errors$.subscribe(error => {
      const event = new CustomEvent('error-message', { detail: error });
      this.el.nativeElement.dispatchEvent(event);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.apiBase && this.eduContentMetadataId) {
      this.editorViewModel.setHttpSettings({
        apiBase: this.apiBase,
        eduContentMetadataId: this.eduContentMetadataId
      });
    }
  }

  public setActiveSlide(viewSlide: TimelineViewSlideInterface): void {
    this.editorViewModel.setActiveSlide(viewSlide);
  }

  public createSlide(): void {
    this.editorViewModel.createSlide();
  }

  public deleteActiveSlide(): void {
    this.editorViewModel.deleteActiveSlide();
  }

  public saveSlide(slide: TimelineViewSlideInterface) {
    this.editorViewModel.upsertSlide(slide);
  }

  public showSettings(): void {
    this.editorViewModel.openSettings();
  }

  public saveSettings(settings: TimelineSettingsInterface): void {
    this.editorViewModel.updateSettings(settings);
  }

  public setIsFormDirty(isDirty: boolean): void {
    this.editorViewModel.setFormDirty(isDirty);
  }
}

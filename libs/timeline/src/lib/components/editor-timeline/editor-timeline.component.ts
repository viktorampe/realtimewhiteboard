import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
export class EditorTimelineComponent implements OnInit, OnChanges, OnDestroy {
  public slideList$: Observable<TimelineViewSlideInterface[]>;
  public activeSlide$: Observable<TimelineViewSlideInterface>;
  public activeSlideDetail$: Observable<TimelineViewSlideInterface>;
  public settings$: Observable<TimelineSettingsInterface>;
  public isFormDirty$: Observable<boolean>;

  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;
  @Output() errors = new EventEmitter<any>();

  private subscriptions = new Subscription();

  constructor(private editorViewModel: EditorViewModel) {}

  @HostBinding('class.timeline-editor') public isTimelineEditor = true;

  ngOnInit() {
    this.slideList$ = this.editorViewModel.slideList$;
    this.activeSlideDetail$ = this.editorViewModel.activeSlideDetail$;
    this.activeSlide$ = this.editorViewModel.activeSlide$;
    this.settings$ = this.editorViewModel.settings$;
    this.isFormDirty$ = this.editorViewModel.isFormDirty$;

    this.subscriptions.add(
      this.editorViewModel.errors$.subscribe(error => {
        this.errors.emit(error);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.apiBase && this.eduContentMetadataId) {
      this.editorViewModel.setHttpSettings({
        apiBase: this.apiBase,
        eduContentMetadataId: this.eduContentMetadataId
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

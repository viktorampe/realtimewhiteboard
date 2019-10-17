import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TimelineSettingsInterface,
  TimelineViewSlideInterface
} from '../../interfaces/timeline';
import {
  FileUploadResult,
  UploadFileOutput
} from '../slide-detail/slide-detail.component';
import { EditorViewModel } from './../editor.viewmodel';
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
  public fileUploadResult$: Observable<FileUploadResult>;

  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;

  constructor(private editorViewModel: EditorViewModel) {}

  @HostBinding('class.timeline-editor') private isTimelineEditor = true;

  ngOnInit() {
    this.slideList$ = this.editorViewModel.slideList$;
    this.activeSlideDetail$ = this.editorViewModel.activeSlideDetail$;
    this.activeSlide$ = this.editorViewModel.activeSlide$;
    this.settings$ = this.editorViewModel.settings$;
    this.isFormDirty$ = this.editorViewModel.isFormDirty$;
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

  public handleFileUpload(upload: UploadFileOutput) {
    this.fileUploadResult$ = this.editorViewModel
      .uploadFile(19, upload.file) //TODO refactor without eduContentId
      .pipe(
        map(storageInfo => ({
          formControlName: upload.formControlName,
          url: `/api/EduFiles/${storageInfo.eduFileId}/redirectURL`
        }))
      );
  }
}

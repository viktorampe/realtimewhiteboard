import {
  ChangeDetectorRef,
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
import { Observable, Subject, Subscription } from 'rxjs';
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
  public canBeSavedAsTitle$: Observable<boolean>;
  public fileUploadResult$ = new Subject<FileUploadResult>();

  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;
  @Output() errors = new EventEmitter<any>();

  private subscriptions = new Subscription();

  constructor(
    private cd: ChangeDetectorRef,
    private editorViewModel: EditorViewModel
  ) {}

  @HostBinding('class.timeline-editor') public isTimelineEditor = true;

  ngOnInit() {
    this.slideList$ = this.editorViewModel.slideList$;
    this.activeSlideDetail$ = this.editorViewModel.activeSlideDetail$;
    this.activeSlide$ = this.editorViewModel.activeSlide$;
    this.settings$ = this.editorViewModel.settings$;
    this.isFormDirty$ = this.editorViewModel.isFormDirty$;
    this.canBeSavedAsTitle$ = this.editorViewModel.activeSlideDetailCanSaveAsTitle$;

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
    this.cd.detectChanges();
  }

  public saveSlide(slide: TimelineViewSlideInterface): void {
    this.editorViewModel.upsertSlide(slide);
    this.cd.detectChanges();
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

  public handleFileUpload(upload: UploadFileOutput): void {
    this.editorViewModel
      .uploadFile(upload.file)
      .pipe(
        map(
          (storageInfo): FileUploadResult => ({
            formControlName: upload.formControlName,
            url: `/api/EduFiles/${storageInfo.eduFileId}/redirectURL`
          })
        )
      )
      .subscribe((result: FileUploadResult) =>
        this.fileUploadResult$.next(result)
      );
  }
}

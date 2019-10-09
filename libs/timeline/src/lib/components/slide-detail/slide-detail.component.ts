import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import {
  TimelineDateInterface,
  TimelineEraInterface,
  TimelineSlideInterface,
  TimelineViewSlideInterface
} from '../../interfaces/timeline';

interface SlideFormDateInterface extends TimelineDateInterface {
  date?: Date;
}

interface SlideFormInterface extends TimelineSlideInterface {
  general?: {
    type: 'slide' | 'era' | 'title';
    group: string;
    display_date: string;
  };
  start_date?: SlideFormDateInterface;
  end_date?: SlideFormDateInterface;
}

export type FormControlName =
  | 'media.url'
  | 'media.thumbnail'
  | 'background.url';

export interface FileUploadResult {
  formControlName: FormControlName;
  url?: string;
}

export interface UploadFileOutput {
  file: File;
  formControlName: FormControlName;
}
@Component({
  selector: 'campus-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: ['./slide-detail.component.scss']
})
export class SlideDetailComponent implements OnInit, OnChanges {
  @Input() viewSlide: TimelineViewSlideInterface;
  @Input() fileUploadResult: FileUploadResult;
  @Output() saveViewSlide = new EventEmitter<TimelineViewSlideInterface>();
  @Output() uploadFile = new EventEmitter<UploadFileOutput>();

  private formData: SlideFormInterface;

  slideForm: FormGroup;
  slideTypes: string[] = ['title', 'slide', 'era'];

  chosenType$: Observable<string>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formData = this.mapViewSlideToFormData(this.viewSlide);
    this.buildForm();
    this.initializeStreams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewSlide)
      this.formData = this.mapViewSlideToFormData(
        changes.viewSlide.currentValue
      );
    if (changes.fileUploadResult && !changes.fileUploadResult.firstChange) {
      this.getControl(
        changes.fileUploadResult.currentValue.formControlName
      ).setValue(changes.fileUploadResult.currentValue.url);
    }
  }

  handleFileInput(files: FileList, formControlName: FormControlName) {
    this.fileUploadResult = { url: '', formControlName };
    const fileToUpload: File = files.item(0);
    this.uploadFile.next({ file: fileToUpload, formControlName });
  }

  handleColorPick(color: string): void {
    this.getControl('background.color').setValue(color);
  }

  private buildForm(): void {
    // validation defaults:
    //  - type: always required
    //  - all other properties: optional
    // validation rules are dependent on the chosen type
    this.slideForm = this.fb.group({
      general: this.fb.group({
        type: [this.formData.general.type, Validators.required],
        group: [this.formData.general.group],
        display_date: [this.formData.general.display_date]
      }),
      start_date: this.fb.group({
        date: [this.formData.start_date.date || null],
        hour: [
          this.formData.start_date.hour || null,
          [Validators.min(0), Validators.max(23), Validators.maxLength(2)]
        ],
        minute: [
          this.formData.start_date.minute || null,
          [Validators.min(0), Validators.max(59), Validators.maxLength(2)]
        ],
        displayDate: [this.formData.start_date.display_date || '']
      }),
      end_date: this.fb.group({
        date: [this.formData.end_date.date || null],
        hour: [
          this.formData.end_date.hour || null,
          [Validators.min(0), Validators.max(23), Validators.maxLength(2)]
        ],
        minute: [
          this.formData.end_date.minute || null,
          [Validators.min(0), Validators.max(59), Validators.maxLength(2)]
        ],
        displayDate: [this.formData.end_date.display_date || '']
      }),
      text: this.fb.group({
        headline: [this.formData.text.headline || ''],
        text: [this.formData.text.text || '']
      }),
      background: this.fb.group({
        url: [this.formData.background.url || ''],
        color: [this.formData.background.color || '']
      }),
      media: this.fb.group({
        url: [this.formData.media.url || ''],
        caption: [this.formData.media.caption || ''],
        credit: [this.formData.media.credit || ''],
        thumbnail: [this.formData.media.thumbnail || ''],
        alt: [this.formData.media.alt || ''],
        title: [this.formData.media.title || ''],
        link: [this.formData.media.link || '']
      })
    });
  }

  private getControl(name: string): FormControl {
    return this.slideForm.get(name) as FormControl;
  }

  private getFormGroup(name: string): FormGroup {
    return this.slideForm.get(name) as FormGroup;
  }

  private initializeStreams() {
    this.chosenType$ = this.getControl('general.type').valueChanges.pipe(
      startWith(this.formData.general.type),
      tap(slideType => {
        this.updateValidatorsForType(slideType);
      })
    );
  }

  private updateValidatorsForType(type: 'era' | 'slide' | 'title'): void {
    // reset
    this.setFormControlAsOptional('start_date.date');
    this.setFormControlAsOptional('end_date.date');
    this.setFormControlAsOptional('media.url');

    switch (type) {
      case 'slide':
        // start_date is required
        // end_date is optional
        // media url is required
        this.setFormControlAsRequired('start_date.date');
        this.setFormControlAsRequired('media.url');
        break;
      case 'title':
        // same as slide, except the start_date is optional
        // media url is required
        this.setFormControlAsRequired('media.url');
        break;
      case 'era':
        // start_date & end_date are required
        // media url is optional
        this.setFormControlAsRequired('start_date.date');
        this.setFormControlAsRequired('end_date.date');
        break;
      default:
        break;
    }
  }

  private setFormControlAsOptional(formControlName: string): void {
    const control = this.getControl(formControlName);
    control.setValidators(null);
    control.updateValueAndValidity();
  }
  private setFormControlAsRequired(formControlName: string): void {
    const control = this.getControl(formControlName);
    control.setValidators([Validators.required]);
    control.updateValueAndValidity();
  }

  private mapViewSlideToFormData(
    viewSlide: TimelineViewSlideInterface
  ): SlideFormInterface {
    const formData: SlideFormInterface = {
      ...this.getInitialSlideForm(), // set all properties
      ...viewSlide // override default properties
    };

    viewSlide.viewSlide = viewSlide.viewSlide as TimelineSlideInterface;

    // add properties that are used by the form, but not needed for the view slide
    formData.general = {
      type: viewSlide.type,
      group: viewSlide.viewSlide.group,
      display_date: viewSlide.viewSlide.display_date
    };
    formData.start_date.date = this.transformTimelineDateToJsDate(
      viewSlide.viewSlide.start_date
    );
    formData.end_date.date = this.transformTimelineDateToJsDate(
      viewSlide.viewSlide.end_date
    );

    return formData;
  }

  private mapFormDataToViewSlide(
    formData: SlideFormInterface
  ): TimelineViewSlideInterface {
    let viewSlideData: TimelineSlideInterface | TimelineEraInterface;

    // check slide type
    if (formData.general.type === 'era') {
      viewSlideData = this.mapFormDataToEra(formData);
    } else {
      // type is 'slide' or 'title'
      viewSlideData = this.mapFormDataToSlide(formData);
    }

    // remove not set properties
    viewSlideData = this.removeEmpty(viewSlideData);

    const viewSlide: TimelineViewSlideInterface = {
      type: formData.general.type,
      viewSlide: viewSlideData,
      label: this.viewSlide.label
    };

    return viewSlide;
  }

  private mapFormDataToEra(formData: SlideFormInterface): TimelineEraInterface {
    const eraData: TimelineEraInterface = {
      start_date: this.getTimelineDate(formData.start_date),
      end_date: this.getTimelineDate(formData.end_date),
      text: formData.text
    };

    return eraData;
  }

  private mapFormDataToSlide(
    formData: SlideFormInterface
  ): TimelineSlideInterface {
    const slideData: TimelineSlideInterface = {
      start_date: this.getTimelineDate(formData.start_date),
      end_date: this.getTimelineDate(formData.end_date),
      group: formData.general.group,
      text: formData.text,
      background: formData.background,
      media: formData.media,
      display_date: formData.general.display_date
    };

    return slideData;
  }

  private getTimelineDate(
    slideFormDate: SlideFormDateInterface
  ): TimelineDateInterface {
    const timelineDate: TimelineDateInterface = {
      ...this.transformJsDateToTimelineDate(slideFormDate.date),
      ...slideFormDate
    };

    return timelineDate;
  }

  private transformTimelineDateToJsDate(
    timelineDate: TimelineDateInterface
  ): Date {
    return new Date(
      timelineDate.year,
      timelineDate.month - 1, // js date object month is zero based
      timelineDate.day ? timelineDate.day : 0 // timeline date day is optional
    );
  }

  private transformJsDateToTimelineDate(jsDate: Date): TimelineDateInterface {
    if (!jsDate) return null;

    const timelineDate: TimelineDateInterface = {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1, // timeline date month is 1 based
      day: jsDate.getDate()
    };

    return timelineDate;
  }

  private getInitialSlideForm(): TimelineSlideInterface {
    const emptySlide: SlideFormInterface = {
      start_date: {
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
        second: null,
        millisecond: null,
        display_date: ''
      },
      end_date: {
        year: null,
        month: null,
        day: null,
        hour: null,
        minute: null,
        second: null,
        millisecond: null,
        display_date: ''
      },
      group: '',
      text: {
        headline: '',
        text: ''
      },
      background: {
        url: '',
        color: ''
      },
      media: {
        url: '',
        caption: '',
        credit: '',
        thumbnail: '',
        alt: '',
        title: '',
        link: ''
      },
      display_date: ''
    };

    return emptySlide;
  }

  private removeEmpty(obj): object {
    const newObj = {};
    // https://stackoverflow.com/questions/42736031/remove-empty-objects-from-an-object?answertab=votes#tab-top
    // delete empty properties
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        newObj[key] = this.removeEmpty(obj[key]); // recurse
      } else if (obj[key] != null && obj[key] !== '') {
        newObj[key] = obj[key]; // copy value
      }
    });

    // delete keys with empty objects
    Object.keys(newObj).forEach(key => {
      if (newObj[key] && typeof newObj[key] === 'object') {
        if (Object.keys(newObj[key]).length === 0) {
          delete newObj[key];
        }
      }
    });

    return newObj;
  }

  onSubmit(): void {
    if (this.slideForm.valid) {
      const outputData = this.mapFormDataToViewSlide(this.slideForm.value);
      console.log(outputData);
      this.saveViewSlide.next(outputData);
    }
  }
}

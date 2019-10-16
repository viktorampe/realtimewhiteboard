import {
  Component,
  EventEmitter,
  HostBinding,
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
import { debounceTime, map, shareReplay, startWith, tap } from 'rxjs/operators';
import {
  TimelineEraInterface,
  TimelineSlideInterface,
  TimelineViewSlideInterface,
  TIMELINE_SLIDE_TYPES
} from '../../interfaces/timeline';

interface SlideFormInterface extends TimelineSlideInterface {
  general?: {
    type: TIMELINE_SLIDE_TYPES;
    group: string;
    display_date: string;
  };
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
  /**
   * Indicates if the current slide can be saved as a title slide.
   * There can be only one title slide per timeline.
   * Used for disabling the title radio button.
   *
   * @type {boolean}
   * @memberof SlideDetailComponent
   */
  @Input() canBeSavedAsTitle: boolean;

  @Output() saveViewSlide = new EventEmitter<TimelineViewSlideInterface>();
  @Output() uploadFile = new EventEmitter<UploadFileOutput>();
  @Output() isDirty$: Observable<boolean>;

  @HostBinding('class.campus-page')
  setCampusPageClass = true;
  @HostBinding('class.timeline-slide-detail')
  setTimelineSlideDetailClass = true;

  private initialFormValues: any; // used for isDirty$
  private formData: SlideFormInterface;

  slideForm: FormGroup;
  slideTypes: string[] = ['title', 'slide', 'era'];
  slideTypesEnum = TIMELINE_SLIDE_TYPES;

  chosenType$: Observable<string>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formData = this.mapViewSlideToFormData(this.viewSlide);
    this.slideForm = this.buildForm();

    this.initialFormValues = { ...this.slideForm.value }; // used for isDirty check
    this.initializeStreams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewSlide && !changes.viewSlide.firstChange) {
      this.formData = this.mapViewSlideToFormData(
        changes.viewSlide.currentValue
      );
      this.slideForm.patchValue(this.formData);
    }
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

  private buildForm(): FormGroup {
    // validation defaults:
    //  - type: always required
    //  - all other properties: optional
    // validation rules are dependent on the chosen type (see updateValidatorsForType())
    return this.fb.group({
      general: this.fb.group({
        type: [this.formData.general.type, Validators.required],
        group: [this.formData.general.group || ''],
        display_date: [this.formData.general.display_date]
      }),
      start_date: this.getDateFormGroup('start_date'),
      end_date: this.getDateFormGroup('end_date'),
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

  private getDateFormGroup(formGroupKey: 'start_date' | 'end_date'): FormGroup {
    return this.fb.group({
      year: [
        this.formData[formGroupKey].year === 0
          ? 0 // user has chosen number 0
          : this.formData[formGroupKey].year || null,
        [Validators.required]
      ],
      month: [
        this.formData[formGroupKey].month || null,
        [Validators.min(1), Validators.max(12), Validators.maxLength(2)]
      ],
      day: [this.formData[formGroupKey].day || null, [Validators.min(1)]],
      hour: [
        this.formData[formGroupKey].hour === 0
          ? 0
          : this.formData[formGroupKey].hour || null,
        [Validators.min(0), Validators.max(23), Validators.maxLength(2)]
      ],
      minute: [
        this.formData[formGroupKey].minute === 0
          ? 0
          : this.formData[formGroupKey].minute || null,
        [Validators.min(0), Validators.max(59), Validators.maxLength(2)]
      ],
      second: [
        this.formData[formGroupKey].second === 0
          ? 0
          : this.formData[formGroupKey].second || null,
        [Validators.min(0), Validators.max(59), Validators.maxLength(2)]
      ],
      millisecond: [this.formData[formGroupKey].millisecond || null],
      display_date: [this.formData[formGroupKey].display_date || '']
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
      }),
      shareReplay(1)
    );

    this.isDirty$ = this.slideForm.valueChanges.pipe(
      debounceTime(300),
      map(
        updatedFormValues =>
          !(
            JSON.stringify(updatedFormValues) ===
            JSON.stringify(this.initialFormValues)
          )
      ),
      startWith(false)
    );
  }

  private updateValidatorsForType(type: TIMELINE_SLIDE_TYPES): void {
    // reset
    this.setFormControlAsOptional('start_date.year');
    this.setFormControlAsOptional('end_date.year');

    switch (type) {
      case TIMELINE_SLIDE_TYPES.SLIDE:
        // start_date is required
        // end_date is optional
        this.setFormControlAsRequired('start_date.year');
        break;
      case TIMELINE_SLIDE_TYPES.TITLE:
        // same as slide, except the start_date is optional
        // so same as reset values
        break;
      case TIMELINE_SLIDE_TYPES.ERA:
        // start_date & end_date are required
        // media url is optional
        this.setFormControlAsRequired('start_date.year');
        this.setFormControlAsRequired('end_date.year');
        break;
      default:
        throw new Error('type not recognised');
    }
  }

  private setFormControlAsOptional(formControlName: string): void {
    const control = this.getControl(formControlName);
    control.clearValidators();
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
      ...viewSlide.viewSlide // override default properties
    };

    viewSlide.viewSlide = viewSlide.viewSlide as TimelineSlideInterface;

    // add properties that are used by the form, but not needed for the view slide
    formData.general = {
      type: viewSlide.type,
      group: viewSlide.viewSlide.group || '', // default to empty string for isDirty$
      display_date: viewSlide.viewSlide.display_date || '' // // default to empty string for isDirty$
    };
    return formData;
  }

  private mapFormDataToViewSlide(
    formData: SlideFormInterface
  ): TimelineViewSlideInterface {
    let viewSlideData: TimelineSlideInterface | TimelineEraInterface;

    // check slide type
    if (formData.general.type === TIMELINE_SLIDE_TYPES.ERA) {
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
      start_date: formData.start_date,
      end_date: formData.end_date,
      text: formData.text
    };

    return eraData;
  }

  private mapFormDataToSlide(
    formData: SlideFormInterface
  ): TimelineSlideInterface {
    const slideData: TimelineSlideInterface = {
      start_date: formData.start_date,
      end_date: formData.end_date,
      group: formData.general.group,
      text: formData.text,
      background: formData.background,
      media: formData.media,
      display_date: formData.general.display_date
    };

    return slideData;
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
      this.saveViewSlide.emit(outputData);
    }
  }
}

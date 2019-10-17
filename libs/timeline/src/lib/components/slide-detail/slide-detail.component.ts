import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith, tap } from 'rxjs/operators';
import { TimelineDateInterface, TimelineEraInterface, TimelineSlideInterface, TimelineViewSlideInterface, TIMELINE_SLIDE_TYPES } from '../../interfaces/timeline';

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

  @ViewChild(MatStepper) stepper: MatStepper;

  @HostBinding('class.campus-page')
  setCampusPageClass = true;
  @HostBinding('class.timeline-slide-detail')
  setTimelineSlideDetailClass = true;

  private initialFormValues: SlideFormInterface; // used for isDirty$
  private formData: SlideFormInterface;

  slideForm: FormGroup;
  slideTypes: { label: string; value: TIMELINE_SLIDE_TYPES }[] = [
    { label: 'titelslide', value: TIMELINE_SLIDE_TYPES.TITLE },
    { label: 'gebeurtenis', value: TIMELINE_SLIDE_TYPES.SLIDE },
    { label: 'tijdspanne', value: TIMELINE_SLIDE_TYPES.ERA }
  ];
  slideTypesEnum = TIMELINE_SLIDE_TYPES;

  chosenType$: Observable<string>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formData = this.mapViewSlideToFormData(this.viewSlide);
    this.slideForm = this.buildForm(); // first time --> build form + add values

    this.initialFormValues = { ...this.slideForm.value }; // used for isDirty check
    this.initializeStreams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewSlide && !changes.viewSlide.firstChange) {
      this.stepper.reset();
      this.formData = this.mapViewSlideToFormData(
        changes.viewSlide.currentValue
      );
      // form already exists --> update form values
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
    this.uploadFile.emit({ file: fileToUpload, formControlName });
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

  private getDateValue(dateValue: number, isZeroPossible: boolean): number {
    if (isZeroPossible) {
      return dateValue === 0 ? 0 : dateValue || null;
    } else {
      return dateValue || null;
    }
  }

  private getDateValues(
    timelineDate: TimelineDateInterface
  ): TimelineDateInterface {
    if (!timelineDate) return { year: null };

    Object.keys(timelineDate).forEach(key => {
      let isZeroPossible = true;
      if (key === 'display_date')
        return (timelineDate[key] = timelineDate[key]);
      if (key === 'month') isZeroPossible = false;

      timelineDate[key] = this.getDateValue(timelineDate[key], isZeroPossible);
    });
    return timelineDate;
  }

  private getDateFormGroup(formGroupKey: 'start_date' | 'end_date'): FormGroup {
    return this.fb.group({
      year: [this.formData[formGroupKey].year, [Validators.required]],
      month: [
        this.formData[formGroupKey].month,
        [Validators.min(1), Validators.max(12), Validators.maxLength(2)]
      ],
      day: [
        this.formData[formGroupKey].day,
        [Validators.min(1), Validators.max(23)]
      ],
      hour: [
        this.formData[formGroupKey].hour,
        [Validators.min(0), Validators.max(23), Validators.maxLength(2)]
      ],
      minute: [
        this.formData[formGroupKey].minute,
        [Validators.min(0), Validators.max(59), Validators.maxLength(2)]
      ],
      second: [
        this.formData[formGroupKey].second,
        [Validators.min(0), Validators.max(59), Validators.maxLength(2)]
      ],
      millisecond: [this.formData[formGroupKey].millisecond, [Validators.min(0)]],
      display_date: [
        this.formData[formGroupKey].display_date || ''
      ]
    });
  }

  private getControl(name: string): FormControl {
    return this.slideForm.get(name) as FormControl;
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
      map(
        updatedFormValues =>
          JSON.stringify(updatedFormValues) !==
          JSON.stringify(this.initialFormValues)
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

  getErrorMessage(field: string): string {
    let errorMessage = '';
    const control = this.getControl(field);
    switch (field) {
      case 'start_date.year':
        errorMessage = control.hasError('required')
          ? 'Je moet een startjaar invullen.'
          : 'Je hebt een ongeldig jaar ingevuld.';
        break;
      case 'end_date.year':
        errorMessage = control.hasError('required')
          ? 'Je moet een eindjaar invullen.'
          : 'Je hebt een ongeldig jaar ingevuld.';
        break;
      case 'start_date.month':
      case 'end_date.month':
        errorMessage =
          control.hasError('min') || control.hasError('max')
            ? 'De maand is een getal van 1 (januari) tot en met 12 (december).'
            : 'Je hebt een ongeldige maand ingevuld.';
        break;
      case 'start_date.day':
      case 'end_date.day':
        errorMessage =
          control.hasError('min') || control.hasError('max')
            ? 'De dag is een getal van 1 tot en met 31.'
            : 'Je hebt een ongeldige dag ingevuld.';
        break;
      case 'start_date.hour':
      case 'end_date.hour':
        errorMessage =
          control.hasError('min') || control.hasError('max')
            ? 'Het uur is een getal van 0 tot en met 23.'
            : 'Je hebt een ongeldig uur ingevuld.';
        break;
      case 'start_date.minute':
      case 'end_date.minute':
        errorMessage =
          control.hasError('min') || control.hasError('max')
            ? 'De minuut is een getal van 0 tot en met 59.'
            : 'Je hebt een ongeldige minuut ingevuld.';
        break;
      case 'start_date.second':
      case 'end_date.second':
        errorMessage =
          control.hasError('min') || control.hasError('max')
            ? 'De seconde is een getal van 0 tot en met 59.'
            : 'Je hebt een ongeldige seconde ingevuld.';
        break;
      case 'start_date.millisecond':
      case 'end_date.millisecond':
        errorMessage = control.hasError('min')
          ? 'De milliseconde kan niet minder dan 0 zijn.'
          : 'Je hebt een ongeldige minuut ingevuld.';
        break;

      default:
        break;
    }
    return errorMessage;
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
    const formData: SlideFormInterface = this.deepMergeObjects(
      this.getInitialSlideForm(),
      viewSlide.viewSlide
    );

    viewSlide.viewSlide = viewSlide.viewSlide as TimelineSlideInterface;

    formData.start_date = this.getDateValues(formData.start_date);
    formData.end_date = this.getDateValues(formData.end_date);

    // add properties that are used by the form, but not needed for the view slide
    formData.general = {
      type: viewSlide.type,
      group: viewSlide.viewSlide.group || '', // default to empty string for isDirty$
      display_date: viewSlide.viewSlide.display_date || '' // // default to empty string for isDirty$
    };

    return formData;
  }

  private deepMergeObjects(source: object, assign: object): object {
    Object.keys(assign).forEach(key => {
      if (assign[key] === Object(assign[key])) {
        // is an object?
        return this.deepMergeObjects(source[key], assign[key]);
      }
      source[key] = assign[key];
    });
    return source;
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
    // delete empty properties
    Object.keys(obj).forEach(key => {
      if (obj[key] === Object(obj[key])) {
        const cleanedValue = this.removeEmpty(obj[key]); // recurse
        if (Object.keys(cleanedValue).length > 0) {
          newObj[key] = cleanedValue;
        }
      } else if (obj[key] !== null && obj[key] !== '') {
        newObj[key] = obj[key]; // copy value
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

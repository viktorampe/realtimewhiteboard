import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatStepper, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
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
  styleUrls: ['./slide-detail.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'after' } }
  ],
  encapsulation: ViewEncapsulation.None
})
export class SlideDetailComponent implements OnInit, OnChanges, OnDestroy {
  private subscriptions = new Subscription();
  private isDirty$: Observable<boolean>;
  public tooltips: { [key: string]: string };

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
  @Output() isDirty = new EventEmitter<boolean>();

  @ViewChild(MatStepper) stepper: MatStepper;

  @HostBinding('class.campus-page')
  setCampusPageClass = true;
  @HostBinding('class.timeline-slide-detail')
  setTimelineSlideDetailClass = true;

  private initialFormValues: any; // used for isDirty$
  private formData: SlideFormInterface;

  slideForm: FormGroup;
  slideTypes: { label: string; value: TIMELINE_SLIDE_TYPES }[] = [
    { label: 'titel', value: TIMELINE_SLIDE_TYPES.TITLE },
    { label: 'gebeurtenis', value: TIMELINE_SLIDE_TYPES.SLIDE },
    { label: 'tijdspanne', value: TIMELINE_SLIDE_TYPES.ERA }
  ];
  slideTypesEnum = TIMELINE_SLIDE_TYPES;

  chosenType$: Observable<string>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formData = this.mapViewSlideToFormData(this.viewSlide);
    this.slideForm = this.buildForm();
    this.initialFormValues = { ...this.slideForm.value }; // used for isDirty check
    this.initializeStreams();
    this.tooltips = this.getTooltipDictionary();

    this.subscriptions.add(
      this.isDirty$.subscribe(isDirty => {
        this.isDirty.emit(isDirty);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewSlide && !changes.viewSlide.firstChange) {
      this.stepper.reset();
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

  onSubmit(): void {
    if (this.slideForm.valid) {
      const outputData = this.mapFormDataToViewSlide(this.slideForm.value);
      this.saveViewSlide.emit(outputData);
    }
  }

  public getControl(name: string): FormControl {
    return this.slideForm.get(name) as FormControl;
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
      displayDate: [this.formData[formGroupKey].display_date || '']
    });
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

  private getTooltipDictionary() {
    return {
      type:
        'titel: een speciaal soort gebeurtenis, wordt als eerste getoond bij het laden van een tijdslijn.\n' +
        'Een tijdslijn heeft maximum 1 titel.\n\n' +
        'gebeurtenis: de standaard bouwblok van een tijdslijn.\n\n' +
        'tijdspanne: dient om in de tijdslijnbalk onderaan een periode aan te duiden.',
      group:
        'optioneel\n' +
        'Gebeurtenissen en tijdspannes met de zelfde groep krijgen op de tijdslijnbalk een eigen rij.',
      display_date:
        'optioneel\n' +
        'Deze tekst wordt getoond in plaats van de ingevoerde datum.',
      start_date:
        'optioneel voor een titel\n' +
        'Deze datum wordt ook gebruikt om de gebeurtenissen en tijdspannes te ordenen.\n' +
        'Een datum bevat minimaal een jaar.',
      end_date:
        'optioneel voor een titel en een gebeurtenis\n' +
        'Een datum bevat minimaal een jaar.',
      headline: 'optioneel, aangeraden \n' + 'De titel van de slide',
      text: 'optioneel, aangeraden \n' + 'De beschrijvende tekst van de slide',
      background:
        'optioneel \n' +
        'Gebruik de knop om een bestand op te laden, \n' +
        'of vul zelf een url in. (incl. http:// )',
      color: 'optioneel \n' + 'Gebruik de knop om een kleur te kiezen',
      url:
        'optioneel \n' +
        'Gebruik de knop om een bestand op te laden, \n' +
        'of vul zelf een url in. (incl. http:// )',
      thumbnail:
        'optioneel \n' +
        'Gebruik de knop om een bestand op te laden, \n' +
        'of vul zelf een url in. (incl. http:// )',
      caption:
        'optioneel \n' +
        'Het bijschrift van het media element.\n' +
        'Dit komt onder het media element.',
      credit:
        'optioneel \n' +
        'De bronvermelding van het media element.\n' +
        'Dit komt direct onder het media element.',
      alt:
        'optioneel \n' +
        'De alternatieve tekst als het media element niet kan weergegeven worden. \n' +
        'Standaardwaarde: bijschrift, indien ingevuld',
      title:
        'optioneel \n' +
        'De titel van het media element, \n' +
        'wordt getoond als de muisaanwijzer zweeft boven het media element \n' +
        'Standaardwaarde: bijschrift, indien ingevuld',
      link: 'optioneel \n' + 'De hyperlink van het media element.'
    };
  }
}

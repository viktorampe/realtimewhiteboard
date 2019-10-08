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
  TimelineSlideInterface,
  TimelineViewSlideInterface
} from '../../interfaces/timeline';

interface SlideFormDateInterface extends TimelineDateInterface {
  date?: Date;
}

interface SlideFormInterface extends TimelineSlideInterface {
  type?: 'slide' | 'era' | 'title';
  start_date?: SlideFormDateInterface;
  end_date?: SlideFormDateInterface;
}

@Component({
  selector: 'campus-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: ['./slide-detail.component.scss']
})
export class SlideDetailComponent implements OnInit, OnChanges {
  @Input() viewSlide: TimelineViewSlideInterface;
  @Output() saveSlide = new EventEmitter<TimelineViewSlideInterface>();

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
    this.formData = this.mapViewSlideToFormData(changes.viewSlide.currentValue);
  }

  buildForm(): void {
    this.slideForm = this.fb.group({
      type: [this.formData.type],
      start_date: this.fb.group({
        date: [this.formData.start_date.date || null], // always required, TODO: make month & day optional
        hour: [this.formData.start_date.hour || null],
        minute: [this.formData.start_date.minute || null],
        displayDate: [this.formData.start_date.display_date || '']
      }),
      end_date: this.fb.group({
        date: [this.formData.end_date.date || null],
        hour: [this.formData.end_date.hour || null],
        minute: [this.formData.end_date.minute || null],
        displayDate: [this.formData.end_date.display_date || '']
      }),
      group: [this.formData.group],
      text: this.fb.group({
        headline: [this.formData.text.headline || ''],
        text: [this.formData.text.text || '']
      }),
      background: this.fb.group({
        url: [this.formData.background.url || ''],
        color: [this.formData.background.color || ''],
        eduFileId: ['']
      }),
      media: this.fb.group({
        url: [this.formData.media.url || ''],
        caption: [this.formData.media.caption || ''],
        credit: [this.formData.media.credit || ''],
        thumbnail: [this.formData.media.thumbnail || ''],
        alt: [this.formData.media.alt || ''],
        title: [this.formData.media.title || ''],
        link: [this.formData.media.link || ''],
        eduFileId: ['']
      }),
      displayDate: [this.formData.display_date]
    });
  }

  getControl(name: string): FormControl {
    return this.slideForm.get(name) as FormControl;
  }

  getFormGroup(name: string): FormGroup {
    return this.slideForm.get(name) as FormGroup;
  }

  private initializeStreams() {
    this.chosenType$ = this.getControl('type').valueChanges.pipe(
      startWith(this.formData.type),
      tap(slideType => {
        if (slideType === 'title') {
          this.setFormControlAsOptional('start_date.date');
        } else {
          this.setFormControlAsRequired('start_date.date');
        }
      })
    );
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
      ...this.getEmptyTimelineSlide(), // set all properties
      ...viewSlide // override default properties
    };

    // add properties that are used by the form, but not needed for the view slide
    formData.type = viewSlide.type;
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
    formData.start_date = this.getTimelineDate(formData.start_date);
    formData.end_date = this.getTimelineDate(formData.end_date);

    delete formData.start_date.date;
    delete formData.end_date.date;

    const viewSlide: TimelineViewSlideInterface = {
      type: formData.type,
      viewSlide: formData,
      label: this.viewSlide.label
    };
    return viewSlide;
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
    const timelineDate: TimelineDateInterface = {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1, // timeline date month is 1 based
      day: jsDate.getDate()
    };

    return timelineDate;
  }

  private getEmptyTimelineSlide(): TimelineSlideInterface {
    const emptySlide: SlideFormInterface = {
      start_date: {
        year: null,
        month: null,
        day: null
      },
      end_date: {
        year: null,
        month: null,
        day: null
      },
      group: '',
      text: {
        headline: '',
        text: ''
      },
      background: {
        url: '',
        color: ''
        // eduFileId: null
      },
      media: {
        url: '',
        caption: '',
        credit: '',
        thumbnail: '',
        alt: '',
        title: '',
        link: ''
        // eduFileId: null
      },
      display_date: ''
    };

    return emptySlide;
  }

  onSubmit(): void {
    if (this.slideForm.valid) {
      const outputData = this.mapFormDataToViewSlide(this.slideForm.value);
      console.log(outputData);
      this.saveSlide.next(outputData);
    }
  }
}

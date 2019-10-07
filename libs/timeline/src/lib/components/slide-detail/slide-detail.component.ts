import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  TimelineDate,
  TimelineSlide,
  TimelineText
} from '../../interfaces/timeline';

interface SlideFormDateInterface {
  date: Date;
  hour: number;
  minute: number;
  displayDate?: string;
}

interface SlideFormInterface {
  startDateTime: SlideFormDateInterface;
  endDateTime: SlideFormDateInterface;
  group: string;
  text: TimelineText;
}

@Component({
  selector: 'campus-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: ['./slide-detail.component.scss']
})
export class SlideDetailComponent implements OnInit, OnChanges {
  private formData: SlideFormInterface;

  @Input() slide: TimelineSlide;
  @Output() saveSlide = new EventEmitter<TimelineSlide>();

  slideForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formData = this.mapSlideToFormData(changes.slide.currentValue);
  }

  buildForm(): void {
    this.slideForm = this.fb.group({
      startDateTime: this.fb.group({
        date: [this.formData.startDateTime.date],
        hour: [this.formData.startDateTime.hour],
        minute: [this.formData.startDateTime.minute]
      }),
      endDateTime: this.fb.group({
        date: [this.formData.endDateTime.date],
        hour: [this.formData.endDateTime.hour],
        minute: [this.formData.endDateTime.minute]
      }),
      group: [this.formData.group],
      text: this.fb.group({
        headline: ['headline'],
        text: ['text']
      })
      // background: [this.slide.background],
      // media: [this.slide.media],
      // display_data: [this.slide.display_date]
    });
  }

  getControl(name: string): FormControl {
    return this.slideForm.get(name) as FormControl;
  }

  getFormGroup(name: string): FormGroup {
    return this.slideForm.get(name) as FormGroup;
  }

  private mapSlideToFormData(slide: TimelineSlide): SlideFormInterface {
    const formData: SlideFormInterface = {
      startDateTime: {
        date: this.transformTimelineDateToJsDate(this.slide.start_date),
        hour: slide.start_date.hour,
        minute: slide.start_date.minute
      },
      endDateTime: {
        date: this.transformTimelineDateToJsDate(slide.end_date),
        hour: slide.end_date.hour,
        minute: slide.end_date.minute
      },
      group: slide.group,
      text: slide.text
    };
    return formData;
  }

  private mapFormDataToSlide(formData: SlideFormInterface): TimelineSlide {
    const slideData: TimelineSlide = {
      start_date: this.transformJsDateToTimelineDate(
        formData.startDateTime.date
      ),
      end_date: this.transformJsDateToTimelineDate(formData.endDateTime.date),
      group: formData.group,
      text: formData.text
    };

    slideData.start_date.hour = formData.startDateTime.hour;
    slideData.start_date.minute = formData.startDateTime.minute;
    slideData.end_date.hour = formData.endDateTime.hour;
    slideData.end_date.minute = formData.endDateTime.minute;

    return slideData;
  }

  private transformTimelineDateToJsDate(timelineDate: TimelineDate): Date {
    return new Date(
      timelineDate.year,
      timelineDate.month - 1, // js date object month is zero based
      timelineDate.day ? timelineDate.day : 0
      // timelineDate.hour ? timelineDate.hour : 0,
      // timelineDate.minute ? timelineDate.minute : 0,
      // timelineDate.second ? timelineDate.second : 0,
      // timelineDate.millisecond ? timelineDate.millisecond : 0
    );
  }

  private transformJsDateToTimelineDate(jsDate: Date): TimelineDate {
    const timelineDate: TimelineDate = {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1, // timeline date month is 1 based
      day: jsDate.getDay()
    };

    return timelineDate;
  }

  onSubmit() {
    if (this.slideForm.valid) {
      console.log(this.mapFormDataToSlide(this.slideForm.value));
      this.saveSlide.next(this.mapFormDataToSlide(this.slideForm.value));
    }
  }
}

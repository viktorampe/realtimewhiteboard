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
import { TimelineDate, TimelineSlide } from '../../interfaces/timeline';

interface SlideFormDateInterface extends TimelineDate {
  date?: Date;
}

interface SlideFormInterface extends TimelineSlide {
  start_date?: SlideFormDateInterface;
  end_date?: SlideFormDateInterface;
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
      start_date: this.fb.group({
        date: [this.formData.start_date.date],
        hour: [this.formData.start_date.hour],
        minute: [this.formData.start_date.minute],
        displayDate: [this.formData.start_date.display_date]
      }),
      end_date: this.fb.group({
        date: [this.formData.end_date.date],
        hour: [this.formData.end_date.hour],
        minute: [this.formData.end_date.minute],
        displayDate: [this.formData.end_date.display_date]
      }),
      group: [this.formData.group],
      text: this.fb.group({
        headline: ['headline'],
        text: ['text']
      }),
      background: this.fb.group({
        url: [''],
        color: [''],
        eduFileId: ['']
      }),
      media: this.fb.group({
        url: [''],
        caption: [''],
        credit: [''],
        thumbnail: [''],
        alt: [''],
        title: [''],
        link: [''],
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

  private mapSlideToFormData(slide: TimelineSlide): SlideFormInterface {
    const formData: SlideFormInterface = {
      ...slide
    };

    formData.start_date.date = this.transformTimelineDateToJsDate(
      slide.start_date
    );
    formData.end_date.date = this.transformTimelineDateToJsDate(slide.end_date);

    return formData;
  }

  private mapFormDataToSlide(formData: SlideFormInterface): TimelineSlide {
    formData.start_date = this.getTimelineDate(formData.start_date);
    formData.end_date = this.getTimelineDate(formData.end_date);

    delete formData.start_date.date;
    delete formData.end_date.date;

    return formData;
  }

  getTimelineDate(slideFormDate: SlideFormDateInterface): TimelineDate {
    const timelineDate: TimelineDate = {
      ...this.transformJsDateToTimelineDate(slideFormDate.date),
      ...slideFormDate
    };

    return timelineDate;
  }

  private transformTimelineDateToJsDate(timelineDate: TimelineDate): Date {
    return new Date(
      timelineDate.year,
      timelineDate.month - 1, // js date object month is zero based
      timelineDate.day ? timelineDate.day : 0 // timeline date day is optional
    );
  }

  private transformJsDateToTimelineDate(jsDate: Date): TimelineDate {
    const timelineDate: TimelineDate = {
      year: jsDate.getFullYear(),
      month: jsDate.getMonth() + 1, // timeline date month is 1 based
      day: jsDate.getDate()
    };

    return timelineDate;
  }

  onSubmit() {
    if (this.slideForm.valid) {
      console.log(this.mapFormDataToSlide(this.slideForm.value));
      // this.saveSlide.next(this.mapFormDataToSlide(this.slideForm.value));
    }
  }
}

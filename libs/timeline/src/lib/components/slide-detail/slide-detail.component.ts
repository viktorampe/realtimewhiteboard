import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TimelineSlide } from '../../interfaces/timeline';

@Component({
  selector: 'campus-slide-detail',
  templateUrl: './slide-detail.component.html',
  styleUrls: ['./slide-detail.component.scss']
})
export class SlideDetailComponent implements OnInit {
  @Input() slide: TimelineSlide;

  slideForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.slideForm = this.fb.group({
      start_date: [this.slide.start_date],
      end_date: [this.slide.end_date],
      group: [this.slide.group],
      text: [this.slide.text],
      background: [this.slide.background],
      media: [this.slide.media],
      display_data: [this.slide.display_date]
    });
  }

  getControl(name: string): FormControl {
    return this.slideForm.get(name) as FormControl;
  }

  onSubmit() {}
}

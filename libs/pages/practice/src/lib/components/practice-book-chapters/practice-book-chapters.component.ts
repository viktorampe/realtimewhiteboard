import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';
import { ChapterWithStatusInterface } from '../practice.viewmodel.selectors';

@Component({
  selector: 'campus-practice-book-chapters',
  templateUrl: './practice-book-chapters.component.html',
  styleUrls: ['./practice-book-chapters.component.scss']
  // providers: [{ provide: PracticeViewModel, useClass: MockPracticeViewModel }]
})
export class PracticeBookChaptersComponent implements OnInit {
  public chaptersWithStatus$: Observable<ChapterWithStatusInterface[]>;

  @HostBinding('class.pages-practice-book-chapters')
  @HostBinding('class.campus-page')
  practiceBookChaptersClass = true;

  constructor(private practiceViewmodel: PracticeViewModel) {}

  private setupStreams() {
    this.chaptersWithStatus$ = this.practiceViewmodel.bookChaptersWithStatus$;
  }
  ngOnInit() {
    this.setupStreams();
  }
}

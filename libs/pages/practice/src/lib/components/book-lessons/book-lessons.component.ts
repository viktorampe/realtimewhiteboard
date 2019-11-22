import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EduContentTOCInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';

export interface CurrentBookLessonsParams {
  book?: number;
  chapter?: number;
  lesson?: number;
}

@Component({
  selector: 'campus-book-lessons',
  templateUrl: './book-lessons.component.html',
  styleUrls: ['./book-lessons.component.scss']
})
export class BookLessonsComponent {
  public currentChapter$: Observable<EduContentTOCInterface>;
  public tocsForToc$: Observable<EduContentTOCInterface[]>;
  public currentBookLessonsParams$: Observable<CurrentBookLessonsParams>;

  constructor(private viewModel: PracticeViewModel, private router: Router) {
    this.initialize();
  }

  clickOpenToc(bookId: number, chapterId: number, lessonId?: number) {
    const dynamicParams = [bookId, chapterId, lessonId].filter(Number);
    this.router.navigate(['/practice', ...dynamicParams]);
  }
  clickToBookChapter(bookId: number) {
    this.router.navigate(['/practice', bookId]);
  }

  private initialize() {
    this.currentChapter$ = this.viewModel.currentChapter$;
    this.tocsForToc$ = this.viewModel.chapterLessons$;
    this.currentBookLessonsParams$ = this.viewModel.currentPracticeParams$;
  }
}

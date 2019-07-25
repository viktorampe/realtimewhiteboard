import { Injectable, InjectionToken } from '@angular/core';
import { ChapterLessonFilterFactory } from './chapter-lesson-filter.factory';

export const DIABOLO_CHAPTER_LESSON_FILTER_FACTORY_TOKEN = new InjectionToken(
  'DiaboloChapterLessonFilterFactory'
);

@Injectable({
  providedIn: 'root'
})
export class DiaboloChapterLessonFilterFactory extends ChapterLessonFilterFactory {
  protected hasDiaboloFilter() {
    return true;
  }
}

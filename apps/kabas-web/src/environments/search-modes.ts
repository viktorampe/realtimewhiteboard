import { EnvironmentSearchModesInterface } from '@campus/shared';
import { EduContentSearchResultComponent } from '../app/components/searchresults/edu-content-search-result.component';
import { ChapterLessonFilterFactory } from '../app/factories/chapter-lesson-filter/chapter-lesson-filter.factory';
import { DiaboloChapterLessonFilterFactory } from '../app/factories/chapter-lesson-filter/diabolo-chapter-lesson-filter.factory';
import { GlobalFilterFactory } from '../app/factories/global-filter/global-filter.factory';

export const searchModes: EnvironmentSearchModesInterface = {
  'chapter-lesson': {
    name: 'chapter-lesson',
    label: 'Zoeken op <b>hoofdstuk</b>',
    dynamicFilters: false,
    searchTerm: {
      domHost: 'searchTerm'
    },
    searchFilterFactory: ChapterLessonFilterFactory,
    results: {
      component: EduContentSearchResultComponent,
      sortModes: [
        {
          description: 'alfabetisch',
          name: 'title.raw',
          icon: 'sort-alpha-down'
        }
      ],
      pageSize: 20
    }
  },
  'diabolo-chapter-lesson': {
    name: 'diabolo-chapter-lesson',
    label: 'Zoeken op <b>hoofdstuk</b>',
    dynamicFilters: false,
    searchTerm: {
      domHost: 'searchTerm'
    },
    searchFilterFactory: DiaboloChapterLessonFilterFactory,
    results: {
      component: EduContentSearchResultComponent,
      sortModes: [
        {
          description: 'alfabetisch',
          name: 'title.raw',
          icon: 'sort-alpha-down'
        }
      ],
      pageSize: 20
    }
  },
  'practice-chapter-lesson': {
    name: 'practice-chapter-lesson',
    label: 'Zoeken op <b>hoofdstuk</b>',
    dynamicFilters: false,
    searchFilterFactory: UnlockedExerciseFilterFactory, // see PR#1325
    results: {
      component: PracticeSearchResultComponent, // see PR#1333
      sortModes: [],
      pageSize: 20
    }
  },
  global: {
    name: 'global',
    label: 'Zoeken in alle inhoud',
    dynamicFilters: false,
    searchTerm: {
      domHost: 'searchTerm'
    },
    searchFilterFactory: GlobalFilterFactory,
    results: {
      component: EduContentSearchResultComponent,
      sortModes: [
        {
          description: 'relevantie',
          name: '_score',
          icon: 'sort-numeric-down'
        },
        {
          description: 'alfabetisch',
          name: 'title.raw',
          icon: 'sort-alpha-down'
        },
        {
          description: 'laatst gewijzigd',
          name: 'published',
          icon: 'calendar-plus'
        }
      ],
      pageSize: 20
    }
  }
};

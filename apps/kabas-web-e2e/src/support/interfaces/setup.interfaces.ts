export interface KabasMethodsPagesInterface {
  kabasMethodsPages: {
    login: { username: string; password: string };
    book: number;
    chapter: number;
    lesson: number;
    lessonLast: number;
    searchTerm: string;
    expected: {
      method: {
        name: string;
        year: string;
      };
      boeke: {
        eduContentId: number;
      };
      generalFiles: {
        count: number;
      };
      chapters: {
        count: number;
      };
      lessons: {
        count: number;
      };
      chapterSearchNoFilters: {
        results: number;
      };
      chapterSearchByTerm: {
        results: number;
      };
      chapterSearchDiabolo: {
        results: number;
      };
      lessonSearchNoFilters: {
        results: number;
      };
      lessonSearchByTerm: {
        results: number;
      };
      lessonSearchDiabolo: {
        results: number;
      };
    };
  };
}

export interface KabasPracticePagesInterface {
  kabasUnlockedFreePracticePages: {
    loginTeacher: { username: string; password: string };
    loginStudent: { username: string; password: string };
    book: number;
    chapter: number;
    lesson: number;
    expected: {
      methodStudent: {
        name: string;
        areaName: string;
      };
      methodTeacher: {
        name: string;
        year: string;
      };
      classGroups: string[];
      chaptersTeacher: {
        count: number;
      };
      chaptersStudent: {
        count: number;
        firstChapter: {
          name: string;
          exercisesAvailable: number;
          exercisesCompleted: number;
          kwetonsRemaining: number;
        };
      };
      lessons: {
        count: number;
      };
      chapterSearchNoFilters: {
        results: number;
      };
      lessonSearchNoFilters: {
        results: number;
      };
    };
  };
}

export interface KabasTasksPagesInterface {
  kabasTasksPages: {
    loginTeacher: { username: string; password: string };
    book: number;
    expected: {};
    manageTaskContent: {
      taskId: number;
      // this expected covers the digital task
      expected: {
        filter: {
          book: {
            id: number;
            bookTitle: string;
            resultCount: number;
            favoriteBookId: number;
            methodName: string;
            favoriteBookTitle: string;
          };
          chapter: {
            id: number;
            resultCount: number;
          };
          lesson: {
            id: number;
            resultCount: number;
          };
          term: {
            value: string;
            resultCount: number;
          };
        };
        search: {
          results: {
            [key: number]: {
              id?: number;
              name: string;
              ludoUrl?: string;
            };
          };
        };
      };
      paperTaskId: number;
      paperExpected: { resultCount: number };
    };
  };
}

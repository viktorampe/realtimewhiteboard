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

export interface ExpectedTaskListItemResult {
  name?: string;
  area?: string;
  startDate?: string;
  endDate?: string;
  classGroups?: string[];
  groupCount?: number;
  individualCount?: number;
  actions: string[];
  favorite?: boolean;
}

export interface AdvancedDateOptions {
  option?: string;
  today?: boolean;
}

export interface TaskAction {
  action: string;
  target: string;
  shouldError?: boolean;
  removesTarget?: boolean;
  fromHeader?: boolean;
  shouldFavorite?: boolean;
}

export interface KabasTasksPagesInterface {
  kabasTasksPages: {
    loginTeacher: { username: string; password: string };
    book: number;
    filterValues: {
      overview: {
        digital: {
          name: string;
          area: string;
          date: AdvancedDateOptions;
          status: number[];
          assignee: string;
          combined: {
            name: string;
            area: string;
            date: AdvancedDateOptions;
            archived: boolean;
            status: number[];
            assignee: string;
          };
        };
        paper: {
          name: string;
          area: string;
          assignee: string;
          combined: {
            name: string;
            area: string;
            archived: boolean;
            assignee: string;
          };
        };
      };
    };
    sortValues: string[];
    paperSortValues: string[];
    taskActions: TaskAction[];
    paperTaskActions: TaskAction[];
    viewTask: string;
    paperViewTask: string;
    expected: {
      filterResults: {
        overview: {
          digital: {
            name: ExpectedTaskListItemResult[];
            area: ExpectedTaskListItemResult[];
            date: ExpectedTaskListItemResult[];
            status: ExpectedTaskListItemResult[];
            archived: ExpectedTaskListItemResult[];
            assignee: ExpectedTaskListItemResult[];
            combined: ExpectedTaskListItemResult[];
          };
          paper: {
            name: ExpectedTaskListItemResult[];
            area: ExpectedTaskListItemResult[];
            archived: ExpectedTaskListItemResult[];
            assignee: ExpectedTaskListItemResult[];
            combined: ExpectedTaskListItemResult[];
          };
        };
      };
      sortResults: {
        digital: {
          [sortModeName: string]: ExpectedTaskListItemResult[];
        };
        paper: {
          [sortModeName: string]: ExpectedTaskListItemResult[];
        };
      };
      smokeResults: {
        digital: ExpectedTaskListItemResult[];
        paper: ExpectedTaskListItemResult[];
      };
      viewTaskId: number;
      paperViewTaskId: number;
    };
  };
}

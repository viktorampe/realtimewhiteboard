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
